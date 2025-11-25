/* eslint-disable no-undef */
import 'dotenv/config';
import express from 'express';
import axios from 'axios';

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

// Proxy endpoint: forwards query params to Discogs /database/search
app.get('/api/discogs/search', async (req, res) => {
  try {
    const params = { ...req.query };
    const headers = {};
    if (DISCOGS_TOKEN) headers['Authorization'] = `Discogs token=${DISCOGS_TOKEN}`;

    // Se não especificou per_page, aumentar para buscar mais resultados (limite Discogs é 100)
    if (!params.per_page) params.per_page = 100;

    const response = await axios.get('https://api.discogs.com/database/search', { params, headers });
    
    // Filtrar resultados por tipo de formato e deduplicar por master_id ou título+ano
    const categoryMaps = {
      'Releases': new Map(),
      'Albums': new Map(),
      'Singles & EPs': new Map(),
      'Compilations': new Map(),
    };

    const results = response.data.results || [];
    results.forEach(item => {
      // Ignore items without title (we need title to dedupe)
      if (!item.title) return;

      // Normalize formats to array
      const formats = Array.isArray(item.format) ? item.format : (item.format ? [item.format] : []);

      // Determine category
      let category = 'Releases';
      if (formats.some(f => /Compilation/i.test(f))) category = 'Compilations';
      else if (formats.some(f => /Single/i.test(f) || /EP/i.test(f))) category = 'Singles & EPs';
      else if (formats.some(f => /Album/i.test(f))) category = 'Albums';

      // Determine dedupe key: prefer master_id, else title+year
      const masterId = item.master_id || null;
      const releaseTitle = (item.title && item.title.includes(' - ')) ? item.title.split(' - ').slice(1).join(' - ').trim() : item.title.trim();
      const year = item.year || null;
      const key = masterId ? `m:${masterId}` : `t:${releaseTitle.toLowerCase()}|y:${year || ''}`;

      const map = categoryMaps[category];
      if (map.has(key)) {
        // increment versions count
        const existing = map.get(key);
        existing.versions = (existing.versions || 1) + 1;
        // prefer to keep the item that has a thumb and year
        if (!existing.thumb && item.thumb) existing.thumb = item.thumb;
        if (!existing.year && item.year) existing.year = item.year;
        map.set(key, existing);
      } else {
        map.set(key, {
          id: item.id,
          master_id: masterId,
          title: releaseTitle,
          year: year,
          thumb: item.thumb || null,
          uri: item.resource_url || item.uri || null,
          formats: formats,
          versions: 1,
        });
      }
    });

    const formatCategories = {};
    const summary = {};
    Object.entries(categoryMaps).forEach(([name, map]) => {
      const arr = Array.from(map.values())
        .sort((a, b) => (a.year || 0) - (b.year || 0));
      formatCategories[name] = arr;
      summary[name] = arr.length;
    });
    summary.Total = Object.values(summary).reduce((s, v) => s + v, 0);

    // Enriquecer itens que não possuem thumbnail consultando o master ou release
    // Fazemos de forma sequencial para reduzir risco de rate limit
    const enrichMissingThumbs = async () => {
      const categoryNames = Object.keys(formatCategories);
      for (const cname of categoryNames) {
        const items = formatCategories[cname];
        for (let i = 0; i < items.length; i++) {
          const it = items[i];
          if (it.thumb) continue;
          try {
            if (it.master_id) {
              const mUrl = `https://api.discogs.com/masters/${it.master_id}`;
              const mResp = await axios.get(mUrl, { headers });
              it.thumb = mResp.data.cover_image || (mResp.data.images && mResp.data.images[0] && mResp.data.images[0].uri) || it.thumb;
            } else if (it.uri) {
              // it.uri can be a resource_url like '/releases/12345' or full url
              const resourceUrl = it.uri.startsWith('http') ? it.uri : `https://api.discogs.com${it.uri}`;
              const rResp = await axios.get(resourceUrl, { headers });
              it.thumb = rResp.data.cover_image || (rResp.data.images && rResp.data.images[0] && rResp.data.images[0].uri) || it.thumb;
            }
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
      artist: results[0]?.title?.split(' - ')[0] || params.artist,
      categories: formatCategories,
      summary,
    };

    res.status(response.status).json(organizedResults);
  } catch (err) {
    console.error('Discogs proxy error:', err.message || err);
    if (err.response) {
      res.status(err.response.status).json(err.response.data);
    } else {
      res.status(500).json({ error: 'Proxy error', message: err.message });
    }
  }
});

app.listen(PORT, () => {
  console.log(`Discogs proxy listening on http://localhost:${PORT}`);
});
