import fs from 'fs';
import path from 'path';
import axios from 'axios';
import process from 'process';

const dbPath = path.join(process.cwd(), 'db', 'cdsDB.json');
const baseDir = 'E:\\DiscografiasPasta';   

// Função para criar pastas recursivamente
function createDir(dirPath) {
    if (!fs.existsSync(dirPath)) {
        fs.mkdirSync(dirPath, { recursive: true });
    }
}
// Função para baixar imagem
async function downloadImage(url, filePath) {
    const headers = {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
    };
    try {
        // Tentar baixar a thumb redimensionada primeiro
        const response = await axios.get(url, { responseType: 'stream', headers });
        const writer = fs.createWriteStream(filePath);
        response.data.pipe(writer);
        return new Promise((resolve, reject) => {
            writer.on('finish', resolve);
            writer.on('error', reject);
        });
    } catch (error) {
        console.error(`Erro ao baixar ${url}:`, error.message);
        // Se falhar, tentar remover parâmetros de redimensionamento
        const originalUrl = url.replace(/\/rs:fit\/g:sm\/q:\d+\/h:\d+\/w:\d+\//, '/');
        try {
            console.log(`Tentando URL original: ${originalUrl}`);
            const response = await axios.get(originalUrl, { responseType: 'stream', headers });
            const writer = fs.createWriteStream(filePath);
            response.data.pipe(writer);
            return new Promise((resolve, reject) => {
                writer.on('finish', resolve);
                writer.on('error', reject);
            });
        } catch (secondError) {
            console.error(`Erro ao baixar URL original ${originalUrl}:`, secondError.message);
        }
    }
}
// Ler o JSON
const dbData = JSON.parse(fs.readFileSync(dbPath, 'utf8'));
// Processar cada artista
for (const artistData of dbData.cdsDB) {
    const artistDir = path.join(baseDir, artistData.artist);
    createDir(artistDir);
    // Processar cada categoria
    for (const [category, items] of Object.entries(artistData)) {
        if (category === 'artist' || !Array.isArray(items)) continue;
        for (const item of items) {
            const folderName = `${item.year || 'Unknown'} - ${item.title}`;
            const itemDir = path.join(artistDir, folderName);
            createDir(itemDir);
            // Baixar thumb se existir
            if (item.thumb) {
                const imagePath = path.join(itemDir, `${item.id}.jpg`);
                await downloadImage(item.thumb, imagePath);
                console.log(`Tentativa de download para ${artistData.artist} - ${item.title}`);
            }
        }
    }
}
console.log('Estrutura de pastas criada com sucesso!');
