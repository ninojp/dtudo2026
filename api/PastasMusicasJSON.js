import { fileURLToPath } from 'url';
import fs from 'node:fs';
import fsPromises from 'node:fs/promises';
import path from 'node:path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// PASTAS DE ORIGEM: E:\MUSICAS\ROCK NACIONAL
// Altere aqui para os diretórios que deseja monitorar
const CONFIG = {
    pastasParaMonitorar: ['E:\\MUSICAS\\ROCK NACIONAL'],
    arquivoSaida: path.resolve(__dirname, '../api/db/mymusicx.json'),
    pastaDestinoImagens: path.resolve(__dirname, '../public/mymusicx/releases'),
    pastaDestinoCapas: path.resolve(__dirname, '../public/mymusicx'),
};

const IMAGE_REGEX = /^(\d+)\.(jpe?g|png|webp|avif)$/i;

const slugify = (text) => {
    if (!text) return '';
    return text
        .normalize('NFD')
        .replace(/\p{Diacritic}/gu, '')
        .replace(/[^a-zA-Z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '')
        .toLowerCase();
};

const ensureDir = async (dirPath) => {
    await fsPromises.mkdir(dirPath, { recursive: true });
};

const mapCategoria = (rawType = '') => {
    const tipo = rawType.normalize('NFD').replace(/\p{Diacritic}/gu, '').toLowerCase();
    if (tipo.includes('single') || tipo.includes('ep')) return 'singles-EP';
    if (tipo.includes('compilacao') || tipo.includes('compilation') || tipo.includes('comp')) return 'compilations';
    if (tipo.includes('video')) return 'videos';
    return 'albums';
};

const parseReleaseNome = (folderName) => {
    const match = folderName.match(/^(\d{4})\s*-\s*(.+?)\s*-\s*(.+)$/);
    if (!match) {
        return { ano: '', titulo: folderName.trim(), categoria: 'albums' };
    }
    const [, ano, titulo, tipo] = match;
    return { ano: ano.trim(), titulo: titulo.trim(), categoria: mapCategoria(tipo.trim()) };
};

const copiarImagemNumeric = async (srcPath, discogsId) => {
    const ext = path.extname(srcPath).toLowerCase();
    const destino = path.join(CONFIG.pastaDestinoImagens, `${discogsId}${ext}`);
    await ensureDir(CONFIG.pastaDestinoImagens);
    const jaExiste = fs.existsSync(destino);
    if (!jaExiste) {
        await fsPromises.copyFile(srcPath, destino);
    }
    return destino;
};

const lerArquivosRelease = async (releasePath) => {
    const dirents = await fsPromises.readdir(releasePath, { withFileTypes: true });
    const arquivos = dirents.filter((d) => d.isFile()).map((d) => d.name);
    const imagemNumerica = dirents.find((d) => d.isFile() && IMAGE_REGEX.test(d.name));
    let discogsId = '';
    if (imagemNumerica) {
        const [, id] = imagemNumerica.name.match(IMAGE_REGEX);
        discogsId = id;
        await copiarImagemNumeric(path.join(releasePath, imagemNumerica.name), discogsId);
    }
    return { arquivos, discogsId };
};

const montarArtistObj = (nomeArtista) => ({
    id: slugify(nomeArtista) || nomeArtista,
    artista: nomeArtista,
    slug: slugify(nomeArtista),
    releases: {
        albums: [],
        'singles-EP': [],
        compilations: [],
        videos: [],
    },
});

const processarArtista = async (baseDir, direntArtista) => {
    const caminhoArtista = path.join(baseDir, direntArtista.name);
    const artistObj = montarArtistObj(direntArtista.name);
    const releases = await fsPromises.readdir(caminhoArtista, { withFileTypes: true });

    for (const releaseDir of releases) {
        if (!releaseDir.isDirectory()) continue;
        const caminhoRelease = path.join(caminhoArtista, releaseDir.name);
        const { ano, titulo, categoria } = parseReleaseNome(releaseDir.name);
        const { arquivos, discogsId } = await lerArquivosRelease(caminhoRelease);
        const releaseObj = {
            discogs_id: discogsId,
            titulo,
            ano,
            arquivosLocais: arquivos,
        };
        artistObj.releases[categoria] = artistObj.releases[categoria] || [];
        artistObj.releases[categoria].push(releaseObj);
    }

    return artistObj;
};

const varrerPastas = async () => {
    const artistasMap = new Map();
    for (const pastaBase of CONFIG.pastasParaMonitorar) {
        if (!fs.existsSync(pastaBase)) {
            console.warn(`Diretório não encontrado: ${pastaBase}`);
            continue;
        }
        const dirents = await fsPromises.readdir(pastaBase, { withFileTypes: true });
        for (const dirent of dirents) {
            if (!dirent.isDirectory()) continue;
            const artista = await processarArtista(pastaBase, dirent);
            if (artistasMap.has(artista.artista)) {
                const existente = artistasMap.get(artista.artista);
                for (const categoria of Object.keys(artista.releases)) {
                    existente.releases[categoria] = [
                        ...existente.releases[categoria],
                        ...artista.releases[categoria],
                    ];
                }
            } else {
                artistasMap.set(artista.artista, artista);
            }
        }
    }
    return Array.from(artistasMap.values());
};

const salvarJson = async (dados) => {
    await ensureDir(path.dirname(CONFIG.arquivoSaida));
    const payload = { mymusicx: dados };
    await fsPromises.writeFile(CONFIG.arquivoSaida, JSON.stringify(payload, null, 4), 'utf8');
};

const executar = async () => {
    const artistas = await varrerPastas();
    await salvarJson(artistas);
    console.log(`Gerado: ${CONFIG.arquivoSaida}`);
};

executar().catch((err) => {
    console.error('Erro ao gerar JSON:', err);
    process.exit(1);
});





