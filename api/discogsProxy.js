/* eslint-disable no-undef */
import 'dotenv/config';
import express from 'express';
import axios from 'axios';
import fs from 'fs';
import path from 'path';

const app = express();
const PORT = process.env.PORT || 4000;
const DISCOGS_TOKEN = process.env.DISCOGS_TOKEN || process.env.VITE_DISCOGS_TOKEN;

app.use(express.json());
// Simples CORS e preflight handling
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  res.header('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,OPTIONS');
  if (req.method === 'OPTIONS') return res.sendStatus(200);
  next();
});
// Busca no Endpoint pelo artista
app.get('/api/discogs/artists', async (req, res) => {
  try {
    const params = Object.assign({}, req.query);
    const headers = {};
    if (DISCOGS_TOKEN) headers['Authorization'] = `Discogs token=${DISCOGS_TOKEN}`;

    const artistSearchParams = {
      q: params.q,
      type: 'artist',
      per_page: 10, // Limitar a 10 resultados para a lista suspensa
    };
    // Buscar artistas no Discogs, ordenados por relevância
    const artistResponse = await axios.get('https://api.discogs.com/database/search', { params: artistSearchParams, headers });
    const artistResults = artistResponse.data.results || [];
    // Retornar lista de artistas com id e title
    const artists = artistResults.map(result => ({
      id: result.id,
      title: result.title,
    }));
    res.status(200).json({ artists });
  } catch (err) {
    console.error('Discogs artists search error:', err.message || err);
    if (err.response) {
      res.status(err.response.status).json(err.response.data);
    } else {
      res.status(500).json({ error: 'Proxy error', message: err.message });
    }
  }
});
app.get('/api/discogs/search', async (req, res) => {
  try {
    const artistId = req.query.artistId;
    const selectedArtistName = req.query.artistName || `Artist ${artistId}`;
    if (!artistId) {
      return res.status(400).json({ error: 'artistId is required' });
    }

    const headers = {};
    if (DISCOGS_TOKEN) headers['Authorization'] = `Discogs token=${DISCOGS_TOKEN}`;

    // Classificação baseada em texto de formato
    const classifyFromFormat = (formatText, role) => {
      if (!formatText) return null;
      const f = formatText.toLowerCase();
      if (role === 'video' || f.includes('video') || f.includes('dvd') || f.includes('vhs') || f.includes('blu-ray')) return 'video';
      if (/compilation|compilação|coletânea|\bcomp\b|,\s*comp($|,)|anthology|antologia/.test(f)) return 'compilation';
      if (f.includes('single') || /\bep\b/.test(f) || f.includes('maxi') || f.includes('7"') || f.includes('12"') || f.includes('cass') || f.includes('cassette')) return 'singleep';
      if (f.includes('album') || f.includes('lp')) return 'album';
      return null;
    };

    // Etapa 1: Buscar todos os lançamentos com paginação
    let allRawReleases = [];
    let nextUrl = `https://api.discogs.com/artists/${artistId}/releases`;
    
    while (nextUrl) {
        const response = await axios.get(nextUrl, { 
            params: (allRawReleases.length === 0 ? { per_page: 100 } : {}), 
            headers 
        });
        allRawReleases.push(...response.data.releases);
        nextUrl = response.data.pagination.urls.next;
        if (nextUrl) {
            await new Promise(resolve => setTimeout(resolve, 200)); // Pequeno delay para ser gentil com a API
        }
    }

    // Agregar formatos e papéis por master_id/id para melhorar classificação sem chamadas extras
    const aggregateMap = new Map();
    for (const rel of allRawReleases) {
      // Para releases sem master_id (ou masters), agregar sob o id
      const key = rel.master_id && rel.master_id !== 0 ? rel.master_id : rel.id;
      const entry = aggregateMap.get(key) || { formats: new Set(), roles: new Set() };
     
      // A API /artists/{id}/releases retorna `format` como string (ex: "CD, Album", "Vinyl, LP")
      const fmt = rel.format;
      if (fmt && typeof fmt === 'string' && fmt !== 'undefined') {
        entry.formats.add(fmt.toLowerCase());
      }
      
      const roleVal = (rel.role || '').toLowerCase();
      if (roleVal) entry.roles.add(roleVal);
      aggregateMap.set(key, entry);
    }
    
    const getAggregatedFormat = (item) => {
      const key = item.type === 'master' ? item.id : (item.master_id || item.id);
      const entry = aggregateMap.get(key);
      if (!entry) return '';
      return Array.from(entry.formats).join('; ');
    };
    
    const hasMainRoleAggregate = (item) => {
      const key = item.type === 'master' ? item.id : (item.master_id || item.id);
      const entry = aggregateMap.get(key);
      if (!entry) return false;
      return entry.roles.has('main');
    };

    // Etapa 2: Desduplicar
    const scoreItem = (item) => {
      let score = 0;
      if (item.type && item.type !== 'master') score += 2;
      if (item.format || item.formats) score += 2;
      if ((item.role || '').toLowerCase() === 'main') score += 1;
      return score;
    };

    const masterIdMap = new Map();
    for (const release of allRawReleases) {
      const key = release.master_id || release.id;
      const current = masterIdMap.get(key);
      if (!current || scoreItem(release) > scoreItem(current)) {
        masterIdMap.set(key, release);
      }
    }
    const allItems = Array.from(masterIdMap.values());
    
    // ENRIQUECIMENTO: Buscar formatos em paralelo (lotes de 5 requisições simultâneas)
    const mastersNeedingFormats = allItems
      .filter(item => item.type === 'master' && (!item.format || item.format === ''))
      .filter(item => (item.role || '').toLowerCase() === 'main')
      .slice(0, 30);
    
    if (mastersNeedingFormats.length > 0) {
      const batchSize = 5; // 5 requisições paralelas
      for (let i = 0; i < mastersNeedingFormats.length; i += batchSize) {
        const batch = mastersNeedingFormats.slice(i, i + batchSize);
        await Promise.all(batch.map(async (master) => {
          if (!master.main_release) return;
          try {
            const releaseResponse = await axios.get(`https://api.discogs.com/releases/${master.main_release}`, { headers });
            const formats = releaseResponse.data.formats || [];
            const formatStrings = formats.map(f => {
              const parts = [f.name];
              if (f.descriptions?.length > 0) parts.push(...f.descriptions);
              return parts.join(', ');
            }).join('; ');
            
            if (formatStrings) {
              const entry = aggregateMap.get(master.id) || { formats: new Set(), roles: new Set() };
              entry.formats.add(formatStrings.toLowerCase());
              aggregateMap.set(master.id, entry);
            }
          } catch {
            // Ignora erros individuais
          }
        }));
        // Delay entre lotes para respeitar rate limit
        if (i + batchSize < mastersNeedingFormats.length) {
          await new Promise(resolve => setTimeout(resolve, 1000));
        }
      }
    }
    
    // Etapa 3: Filtro principal
    const filteredByArtist = allItems.filter(item => {
      const role = (item.role || '').toLowerCase();
      if (role === 'main') return true;
      if (hasMainRoleAggregate(item)) return true;
      return false;
    });

    // Etapa 4: Classificar releases
    const enrichedItems = [];

    const looksLikeCompilationTitle = (title) => {
      const t = (title || '').toLowerCase();
      return /compilation|compilação|coletânea|seleção essencial|best of|greatest hits|anthology|antologia|raridades|mega hits|perfil|quatro em um|sem limite|o melhor de|o melhor do|o melhor da|\d+\s+música/.test(t);
    };

    const isLikelySingleMaster = (title, aggFormat) => {
      const t = (title || '').toLowerCase().trim();
      const f = (aggFormat || '').toLowerCase();
      if (/single|\bep\b|maxi|7"|12"|cass|cassette/.test(f)) return true;
      // Vinyl without LP hints and short title → likely single
      if (f.includes('vinyl') && !f.includes('lp')) {
        const wordCount = t.split(/\s+/).filter(Boolean).length;
        if (wordCount <= 3 && t.length <= 20) return true;
      }
      return false;
    };

    for (const item of filteredByArtist) {
      const role = (item.role || '').toLowerCase();
      // Usar formato agregado quando o formato local estiver vazio
      const aggregatedFormat = getAggregatedFormat(item);
      const formatText = (item.format && String(item.format).trim()) ? String(item.format) : aggregatedFormat;
      let category = null;

      // Classificação por ordem de prioridade:
      
      // 1. Checar role primeiro (mais confiável)
      if (role === 'video') {
        category = 'video';
      } else {
        // 2. Tentar classificar pelo formato (inclui agregado)
        category = classifyFromFormat(formatText, role, item.type);
        
        // 3. Se ainda não classificado, usar heurísticas locais
        if (!category) {
          if (item.type === 'master') {
            // Masters: priorizar vídeo/comp/single via formato agregado
            const agg = aggregatedFormat.toLowerCase();
            const aggClass = classifyFromFormat(aggregatedFormat, role, item.type);
            if (aggClass === 'video' || /(dvd|vídeo|video|blu-?ray|vhs)/i.test(item.title || '')) {
              category = 'video';
            } else if (aggClass === 'compilation' || looksLikeCompilationTitle(item.title)) {
              category = 'compilation';
            } else if (aggClass === 'singleep' || isLikelySingleMaster(item.title, aggregatedFormat)) {
              category = 'singleep';
            } else if (agg.includes('album') || agg.includes('lp')) {
              category = 'album';
            } else {
              // Sem pistas claras: assumir ÁLBUM para masters
              category = 'album';
            }
          } else {
            // Releases: verificar título para singles/promo
            const titleLower = (item.title || '').toLowerCase();
            if (/single|ep|maxi|promo|remix/.test(titleLower)) {
              category = 'singleep';
            } else {
              // Formato genérico sem pistas no título → assumir single/EP
              const f = formatText.toLowerCase().trim();
              if (f === 'vinyl' || f === 'cd' || f === 'file' || f === '') {
                category = 'singleep';
              } else {
                category = 'singleep';
              }
            }
          }
        }
      }

      const enrichedItem = { ...item, format: formatText, _category: category };
      enrichedItems.push(enrichedItem);
    }

    const officialItems = enrichedItems.filter(item => {
      const formatText = (item.format || '').toLowerCase();
      return !formatText.includes('unofficial');
    });

    // Etapa 5: Categorizar a lista final e correta.
    const categorized = {
      albums: [], singlesEPs: [], compilations: [], videos: [],
    };

    officialItems.forEach(item => {
      const role = (item.role || '').toLowerCase();
      const formatText = (item.format || '').toLowerCase();
      const finalCategory = item._category || classifyFromFormat(formatText, role, item.type) || null;

      if (finalCategory === 'video') {
        categorized.videos.push(item);
      } else if (finalCategory === 'compilation') {
        categorized.compilations.push(item);
      } else if (finalCategory === 'album') {
        categorized.albums.push(item);
      } else if (finalCategory === 'singleep') {
        categorized.singlesEPs.push(item);
      } else {
        // Fallback: se ainda não decidido, considerar EP/Single
        categorized.singlesEPs.push(item);
      }
    });

    // Logs reduzidos para performance

    // Etapa 6: Organizar a resposta final.
    const organizedResults = {
      artist: selectedArtistName,
      items: officialItems,
      summary: {
        Total: officialItems.length,
        categories: {
          albums: { count: categorized.albums.length, items: categorized.albums },
          singlesEPs: { count: categorized.singlesEPs.length, items: categorized.singlesEPs },
          compilations: { count: categorized.compilations.length, items: categorized.compilations },
          videos: { count: categorized.videos.length, items: categorized.videos }
        }
      }
    };
    
    console.log(`[DISCOGS] Artist: ${selectedArtistName} | Total: ${organizedResults.summary.Total} | Albums: ${categorized.albums.length} | Singles/EPs: ${categorized.singlesEPs.length} | Compilations: ${categorized.compilations.length} | Videos: ${categorized.videos.length}`);
    
    // DEBUG: Mostrar vídeos encontrados
    if (categorized.videos.length > 0) {
      console.log(`\n[VÍDEOS ENCONTRADOS] (${categorized.videos.length}):`);
      categorized.videos.forEach(item => {
        console.log(`  - ID: ${item.id} | "${item.title}" | Format: "${item.format}"`);
      });
    } else {
      console.log(`\n[VÍDEOS] Nenhum vídeo encontrado. Analisando itens filtrados vs não-filtrados:`);
      const videoRoleItems = allItems.filter(item => (item.role || '').toLowerCase() === 'video');
      console.log(`  - Items com role='video': ${videoRoleItems.length}`);
      
      // Mostrar items que foram REMOVIDOS pelo filtro de papel
      const filteredOut = allItems.filter(item => {
        const role = (item.role || '').toLowerCase();
        return role !== 'main' && !hasMainRoleAggregate(item);
      });
      console.log(`  - Items removidos pelo filtro de papel: ${filteredOut.length}`);
      console.log(`    (Mostrando até 15 itens removidos para investigação:`);
      filteredOut.slice(0, 15).forEach(item => {
        console.log(`      ID: ${item.id} | Role: "${item.role}" | Format: "${item.format}" | AggFormat: "${getAggregatedFormat(item)}" | Title: "${item.title}"`);
      });
    }
    
    // DEBUG: Mostrar compilações encontradas
    if (categorized.compilations.length > 0) {
      console.log(`\n[COMPILAÇÕES ENCONTRADAS] (${categorized.compilations.length}):`);
      categorized.compilations.forEach(item => {
        console.log(`  - ID: ${item.id} | "${item.title}" | Format: "${item.format}"`);
      });
    }
    
    // DEBUG: Mostrar álbuns para investigar se há itens categorizados errado
    console.log(`\n[ÁLBUNS] (${categorized.albums.length} - esperado 20):`);
    console.log(`  Primeiros 10 álbuns:`);
    categorized.albums.slice(0, 10).forEach(item => {
      console.log(`  - ID: ${item.id} | "${item.title}" | Format: "${item.format}" | Type: "${item.type}"`);
    });
    
    res.status(200).json(organizedResults);
  } catch (err) {
    console.error('Discogs proxy error:', err.message || err, err.stack);
    if (err.response) {
      res.status(err.response.status).json(err.response.data);
    } else {
      res.status(500).json({ error: 'Proxy error', message: err.message });
    }
  }
});

// Endpoint para salvar os daados do artista no DB.JSON local
app.post('/api/discogs/save', (req, res) => {
  try {
    const { artist, items } = req.body;
    if (!artist || !items) {
      return res.status(400).json({ error: 'Missing artist or items data' });
    }
    const dbPath = path.join(process.cwd(), 'api', 'db', 'cdsDB.json');
    let dbData = { cdsDB: [] };
    if (fs.existsSync(dbPath)) {
      const dbContent = fs.readFileSync(dbPath, 'utf8');
      dbData = JSON.parse(dbContent);
    }

    // Verifica se o artista já existe
    const existingIndex = dbData.cdsDB.findIndex(item => item.artist.toLowerCase() === artist.toLowerCase());
    const artistData = {
      artist,
      items: items || []
    };

    if (existingIndex !== -1) {
      // Atualiza o existente
      dbData.cdsDB[existingIndex] = artistData;
    } else {
      // Adiciona um novo
      dbData.cdsDB.push(artistData);
    }

    fs.writeFileSync(dbPath, JSON.stringify(dbData, null, 2));
    res.json({ message: 'Dados do artista salvos com sucesso.' });
  } catch (err) {
    console.error('Save error:', err);
    res.status(500).json({ error: 'ERRO! ao Salvar dados do artista.' });
  }
});

app.listen(PORT, () => {
  console.log(`discogsProxy.js listening on http://localhost:${PORT}`);
});
