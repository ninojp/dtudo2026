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

// Simple CORS and preflight handling
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  res.header('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,OPTIONS');
  if (req.method === 'OPTIONS') return res.sendStatus(200);
  next();
});

// Endpoint to search for artists
app.get('/api/discogs/artists', async (req, res) => {
  try {
    const params = { ...req.query };
    const headers = {};
    if (DISCOGS_TOKEN) headers['Authorization'] = `Discogs token=${DISCOGS_TOKEN}`;

    const artistSearchParams = {
      q: params.q,
      type: 'artist',
      per_page: 10, // Limitar a 10 resultados para a lista suspensa
    };
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

// Proxy endpoint: get releases for a specific artist
app.get('/api/discogs/search', async (req, res) => {
  try {
    const params = { ...req.query };
    const headers = {};
    if (DISCOGS_TOKEN) headers['Authorization'] = `Discogs token=${DISCOGS_TOKEN}`;

    if (!params.artistId) {
      return res.status(400).json({ error: 'artistId is required' });
    }

    const artistId = params.artistId;

    // Buscar os releases do artista
    const releasesResponse = await axios.get(`https://api.discogs.com/artists/${artistId}/releases`, { params: { per_page: 100 }, headers });
    let releases = releasesResponse.data.releases || [];

    // Deduplicar releases por master_id ou title+year (como no código original)
    const seen = new Map();
    releases = releases.filter(item => {
      const masterId = item.master_id || null;
      const releaseTitle = (item.title && item.title.includes(' - ')) ? item.title.split(' - ').slice(1).join(' - ').trim() : item.title.trim();
      const year = item.year || null;
      const key = masterId ? `m:${masterId}` : `t:${releaseTitle.toLowerCase()}|y:${year || ''}`;
      if (seen.has(key)) return false;
      seen.set(key, item);
      return true;
    });

    // Categorizar resultados por tipo de formato
    const formatCategories = {
      'Releases': [],
      'Albums': [],
      'Singles & EPs': [],
      'Compilations': [],
    };

    releases.forEach(item => {
      // Normalize formats to array
      const formats = Array.isArray(item.format) ? item.format : (item.format ? [item.format] : []);

      // Determine category
      let category = 'Releases';
      if (formats.some(f => /Compilation/i.test(f))) category = 'Compilations';
      else if (formats.some(f => /Single/i.test(f) || /EP/i.test(f))) category = 'Singles & EPs';
      else if (formats.some(f => /Album/i.test(f))) category = 'Albums';

      formatCategories[category].push({
        id: item.id,
        master_id: item.master_id,
        title: item.title,
        year: item.year,
        thumb: item.thumb || null,
        resource_url: item.resource_url,
        formats: formats,
      });
    });

    const summary = {};
    Object.entries(formatCategories).forEach(([name, arr]) => {
      summary[name] = arr.length;
    });
    summary.Total = Object.values(summary).reduce((s, v) => s + v, 0);

    // Enriquecer itens que não possuem thumbnail consultando o release
    // Fazemos de forma sequencial para reduzir risco de rate limit
    const enrichMissingThumbs = async () => {
      const categoryNames = Object.keys(formatCategories);
      for (const cname of categoryNames) {
        const items = formatCategories[cname];
        for (let i = 0; i < items.length; i++) {
          const it = items[i];
          if (it.thumb) continue;
          try {
            const resourceUrl = it.resource_url.startsWith('http') ? it.resource_url : `https://api.discogs.com${it.resource_url}`;
            const rResp = await axios.get(resourceUrl, { headers });
            it.thumb = rResp.data.cover_image || (rResp.data.images && rResp.data.images[0] && rResp.data.images[0].uri) || it.thumb;
          } catch (e) {
            console.warn('Enrich thumb failed for', it.title, e.message || e);
          }
          // small delay to be polite (50ms)
          await new Promise(r => setTimeout(r, 50));
        }
      }
    };

    await enrichMissingThumbs();

    // Organizar resposta com contagem por categoria
    const organizedResults = {
      artist: params.artistName || `Artist ${artistId}`, // Usar artistName se passado, senão placeholder
      categories: formatCategories,
      summary,
    };

    res.status(200).json(organizedResults);
  } catch (err) {
    console.error('Discogs proxy error:', err.message || err);
    if (err.response) {
      res.status(err.response.status).json(err.response.data);
    } else {
      res.status(500).json({ error: 'Proxy error', message: err.message });
    }
  }
});

// Endpoint to save artist data to local JSON
app.post('/api/discogs/save', (req, res) => {
  try {
    const { artist, categories } = req.body;
    if (!artist || !categories) {
      return res.status(400).json({ error: 'Missing artist or categories data' });
    }

    const dbPath = path.join(process.cwd(), 'api', 'db', 'cdsDB.json');
    let dbData = { cdsBD: [] };
    if (fs.existsSync(dbPath)) {
      const dbContent = fs.readFileSync(dbPath, 'utf8');
      dbData = JSON.parse(dbContent);
    }

    // Check if artist already exists
    const existingIndex = dbData.cdsBD.findIndex(item => item.artist.toLowerCase() === artist.toLowerCase());
    const artistData = {
      artist,
      Albums: categories.Albums || [],
      Compilations: categories.Compilations || [],
      Releases: categories.Releases || [],
      "Singles & EPs": categories["Singles & EPs"] || []
    };

    if (existingIndex !== -1) {
      // Update existing
      dbData.cdsBD[existingIndex] = artistData;
    } else {
      // Add new
      dbData.cdsBD.push(artistData);
    }

    fs.writeFileSync(dbPath, JSON.stringify(dbData, null, 2));
    res.json({ message: 'Artist data saved successfully' });
  } catch (err) {
    console.error('Save error:', err);
    res.status(500).json({ error: 'Failed to save data' });
  }
});

app.listen(PORT, () => {
  console.log(`Discogs proxy listening on http://localhost:${PORT}`);
});
