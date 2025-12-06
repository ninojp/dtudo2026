/* eslint-env node */
import { fileURLToPath } from 'url';
import fs from 'node:fs';
import fsPromises from 'node:fs/promises';
import path from 'node:path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// --- Configuração ---
// Altere aqui para os diretórios que deseja monitorar
const pastasParaMonitorar = [
    'F:\\A', 'F:\\B', 'F:\\C', 'F:\\D', 'F:\\E', 'F:\\F', 'F:\\G', 'F:\\H', 'F:\\I', 'F:\\J',
    'F:\\K', 'F:\\L', 'F:\\M', 'F:\\N', 'F:\\O', 'F:\\P', 'F:\\Q', 'F:\\R', 'H:\\S', 'H:\\T', 'H:\\U', 'H:\\V', 'H:\\W', 'H:\\X', 'H:\\Y', 'H:\\Z'
];
const arquivoSaida = path.resolve(__dirname, '../api/db/myanimes.json');
const pastaDestinoImagens = path.resolve(__dirname, '../public/myanimes/animes');

/**
 * Varre recursivamente até 2 níveis de subpasta dos diretórios de origem, 
 * encontra imagens com nomes numéricos (ex: 123.jpg) e as copia para a pasta de destino.
 */
async function copiarImagensRelevantes(pastasOrigem, pastaDestino) {
    console.log(`Iniciando cópia de imagens para: ${pastaDestino}`);
    await ensureDir(pastaDestino);
    let imagensCopiadas = 0;

    const MAX_DEPTH = 2; // Limita a busca a 2 níveis de subpasta

    async function walk(diretorio, depth) {
        // Garante que o diretório é uma string válida antes de prosseguir.
        if (typeof diretorio !== 'string' || !fs.existsSync(diretorio)) {
            return;
        }

        if (depth > MAX_DEPTH) {
            return; // Para a recursão se a profundidade máxima for atingida
        }

        const entradas = await readDirSafe(diretorio);
        for (const entrada of entradas) {
            const caminhoCompleto = path.join(diretorio, entrada.name);
            if (entrada.isDirectory()) {
                await walk(caminhoCompleto, depth + 1); // Recursão para subpastas, incrementando a profundidade
            } else if (entrada.isFile() && /^\d+\.jpg$/i.test(entrada.name)) {
                const caminhoDestino = path.join(pastaDestino, entrada.name);
                try {
                    await fsPromises.copyFile(caminhoCompleto, caminhoDestino);
                    imagensCopiadas++;
                } catch (err) {
                    console.error(`Erro ao copiar ${caminhoCompleto}:`, err);
                }
            }
        }
    }

    await Promise.all(pastasOrigem.map(pasta => walk(pasta, 0)));
    console.log(`Cópia de imagens concluída. Total de ${imagensCopiadas} imagens copiadas.`);
}
// --- Helpers ---
/** SLUGIFY: do curso alura, testar pra ver se é melhor que o atual
 * .toLowerCase()
    .normalize('NFD').replace(/\p{Diacritic}/gu, '') // Remove acentuação
    .replace(/[^a-z0-9\s-]/g, '') // Remove caracteres especiais
    .trim() // Remove espaços do início e fim
    .replace(/\s+/g, '-'); // Troca espaços por hífens
 */
function normalizeName(name = '') {
    return String(name)
        .normalize('NFKD')
        .replace(/\p{M}/gu, '') // remove diacríticos
        .toLowerCase()
        .replace(/\s+/g, '_')
        .replace(/[^a-z0-9._-]+/g, '_')
        .replace(/_+/g, '_')
        .replace(/^_+|_+$/g, '');
}
// Gera slug a partir do nome
function slugify(name = '') {
    return normalizeName(name).replace(/[_]+/g, '-');
}
// Garante que a pasta exista
async function ensureDir(dirPath) {
    try {
        await fsPromises.mkdir(dirPath, { recursive: true });
    } catch (err) {
        // Se a pasta já existir em condições de corrida, ignore
        if (err.code !== 'EEXIST') throw err;
    }
}
// Lê diretório de forma segura, retornando array vazio em caso de erro
async function readDirSafe(dir) {
    try { // Garante que 'dir' seja uma string antes de usar
        if (typeof dir !== 'string') return [];
        return await fsPromises.readdir(dir, { withFileTypes: true });
    } catch (err) {
        console.warn(`Não foi possível ler ${dir}: ${err.message}`);
        return [];
    }
}
/** Retorna array de objetos { nome, tipo: 'arquivo'|'pasta' } */
async function listContents(dir) {
    const entries = await readDirSafe(dir);
    return entries.map((entry) => ({ nome: entry.name, tipo: entry.isDirectory() ? 'pasta' : 'arquivo' }));
}
/** Gera a estrutura desejada a partir das pastas listadas */
async function gerarEstruturaPersonalizada(pastas) {
  const processarPastaRaiz = async (pastaRaiz) => {
    const itensRaiz = await readDirSafe(pastaRaiz);
    const pastasDeAnime = itensRaiz.filter((it) => it.isDirectory());

    return Promise.all(pastasDeAnime.map(async (item) => {
      const fullPath = path.join(pastaRaiz, item.name);
      const subdirs = (await readDirSafe(fullPath)).filter((it) => it.isDirectory());

      const subpastas = await Promise.all(subdirs.map(async (sub) => {
        const subFullPath = path.join(fullPath, sub.name);
        const conteudo = await listContents(subFullPath);
        const jpg = conteudo.find((arq) => arq.tipo === 'arquivo' && /^\d+\.jpg$/i.test(arq.nome));
        const idSubpasta = jpg ? parseInt(jpg.nome, 10) : null;
        const ano = sub.name.substring(0, 4);
        const nomeSemAno = sub.name.substring(5).trim();
        return { id: idSubpasta, nome: sub.name, ano, nomeSemAno, arquivos: conteudo };
      }));

      return {
        nome: item.name,
        slug: slugify(item.name),
        imgSrc: `${normalizeName(item.name)}.jpg`,
        subpastas,
      };
    }));
  };

  const arraysDeResultados = await Promise.all(pastas.map(processarPastaRaiz));
  return arraysDeResultados.flat().map((item, index) => ({ ...item, id: index + 1 }));
}

/** Escreve JSON de forma atômica (escreve em arquivo temporário e renomeia) */
async function writeJsonAtomically(targetPath, data) {
    const dir = path.dirname(targetPath);
    await ensureDir(dir);
    const tmpPath = `${targetPath}.${Date.now()}.tmp`;
    await fsPromises.writeFile(tmpPath, JSON.stringify(data, null, 2), 'utf8');
    await fsPromises.rename(tmpPath, targetPath);
}

// --- Atualização / debounce ---
async function atualizarAnimacoes() {
    try {
        // Executa a cópia das imagens antes de gerar o JSON
        await copiarImagensRelevantes(pastasParaMonitorar, pastaDestinoImagens);

        const estrutura = await gerarEstruturaPersonalizada(pastasParaMonitorar);
        let jsonAtual = {};

        try {
            if (fs.existsSync(arquivoSaida)) {
                const raw = await fsPromises.readFile(arquivoSaida, 'utf8');
                jsonAtual = raw ? JSON.parse(raw) : {};
            }
        } catch (readErr) {
            console.warn(`Falha ao ler ${arquivoSaida}: ${readErr.message}`);
            jsonAtual = { objAnimex: [] };
        }

        jsonAtual.objAnimex = estrutura;
        jsonAtual.ultimaAtualizacao = new Date().toISOString();

        await writeJsonAtomically(arquivoSaida, jsonAtual);
        console.log(`Arquivo ${arquivoSaida} atualizado com sucesso!`);
    } catch (err) {
        console.error('Erro ao atualizar animacoes.json:', err);
    }
}
// --- Execução Principal ---
console.log('Iniciando a geração do arquivo de animes...');
atualizarAnimacoes();
