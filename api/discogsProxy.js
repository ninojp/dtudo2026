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
    // console.log('Releases response data:', releasesResponse.data);
    let releases = releasesResponse.data.releases || [];
    // Prepare the final list of items
    const allItems = releases.map(item => {
      const artistName = item.artist || (Array.isArray(item.artists) ? item.artists.map(a => a.name).join(', ') : '');
      return {
        id: item.id,
        master_id: item.master_id,
        artist: artistName,
        title: item.title,
        year: item.year,
        thumb: item.thumb || null,
        resource_url: item.resource_url,
        formats: item.formats || item.format || [],
        type: item.type,
      };
    });

    //Enrich missing thumbs sequentially
    for (const item of allItems) {
      if (!item.thumb) {
        try {
          const resourceUrl = item.resource_url.startsWith('http') ? item.resource_url : `https://api.discogs.com${item.resource_url}`;
          const rResp = await axios.get(resourceUrl, { headers });
          item.thumb = rResp.data.cover_image || (rResp.data.images && rResp.data.images[0] && rResp.data.images[0].uri) || item.thumb;
        } catch (e) {
          console.warn('Enrich thumb failed for', item.title, e.message || e);
        }
        // Small delay to be polite
        await new Promise(r => setTimeout(r, 50));
      }
    }
    // Organize response with total count
    const organizedResults = {
      artist: params.artistName || `Artist ${artistId}`,
      items: allItems,
      summary: { Total: allItems.length },
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

    // Check if artist already exists
    const existingIndex = dbData.cdsDB.findIndex(item => item.artist.toLowerCase() === artist.toLowerCase());
    const artistData = {
      artist,
      items: items || []
    };

    if (existingIndex !== -1) {
      // Update existing
      dbData.cdsDB[existingIndex] = artistData;
    } else {
      // Add new
      dbData.cdsDB.push(artistData);
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
