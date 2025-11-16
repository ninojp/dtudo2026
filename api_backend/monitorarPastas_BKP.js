import { fileURLToPath } from 'url';
import fs from 'node:fs';
import path from 'node:path';
import chokidar from 'chokidar';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Normaliza nomes: remove diacríticos, converte para lowercase, substitui
// espaços e caracteres problemáticos por '_' e colapsa underscores repetidos.
function normalizeName(name) {
    if (!name) return '';
    // Remove diacríticos (acentos)
    const noDiacritics = name.normalize('NFKD').replace(/\p{M}/gu, '');
    const lower = noDiacritics.toLowerCase();
    // substitui espaços por '_', e qualquer sequência de caracteres não alfanum/._- por '_'
    const replaced = lower.replace(/\s+/g, '_').replace(/[^a-z0-9._-]+/g, '_');
    // colapsa múltiplos '_' e remove '_' nas bordas
    return replaced.replace(/_+/g, '_').replace(/^_+|_+$/g, '');
}

// Liste aqui as pastas específicas que deseja monitorar
const pastasParaMonitorar = [
    'F:\\A', 'F:\\B', 'F:\\C', 'F:\\D', 'F:\\E', 'F:\\F', 'F:\\G', 'F:\\H', 'F:\\I', 'F:\\J',
    'F:\\K', 'F:\\L', 'F:\\M', 'F:\\N', 'F:\\O', 'F:\\P', 'F:\\Q', 'F:\\R', 'H:\\S', 'H:\\T', 'H:\\U', 'H:\\V', 'H:\\W', 'H:\\X', 'H:\\Y', 'H:\\Z'
];

// Resolve o caminho do arquivo JSON relativo ao diretório atual do script
const arquivoSaida = path.resolve(__dirname, '../../db/animacoes.json');
const diretorioArquivoSaida = path.dirname(arquivoSaida);

// Cria o diretório de saída se não existir
try {
    if (!fs.existsSync(diretorioArquivoSaida)) {
        fs.mkdirSync(diretorioArquivoSaida, { recursive: true });
        console.log(`Diretório criado: ${diretorioArquivoSaida}`);
    }
} catch (erro) {
    console.error(`Erro ao criar diretório ${diretorioArquivoSaida}:`, erro);
    process.exit(1);
}

// Função principal para gerar a estrutura personalizada
function gerarEstruturaPersonalizada(pastasParaMonitorar) {
    let idGlobal = 1;
    return pastasParaMonitorar.flatMap(pastaRaiz => {
        let itensRaiz;
        try {
            itensRaiz = fs.readdirSync(pastaRaiz, { withFileTypes: true });
        } catch (erro) {
            console.warn(`Não foi possível ler ${pastaRaiz}: ${erro.message}`);
            return [];
        }
        // Apenas pastas do segundo nível
        return itensRaiz
            .filter(item => item.isDirectory())
            .map(item => {
                const fullPath = path.join(pastaRaiz, item.name);
                // Lê as subpastas do segundo nível
                let subpastas = [];
                try {
                    subpastas = fs.readdirSync(fullPath, { withFileTypes: true })
                        .filter(subitem => subitem.isDirectory())
                        .map(subitem => {
                            const subFullPath = path.join(fullPath, subitem.name);
                            // Lê arquivos e subpastas da subpasta
                            let conteudo = [];
                            try {
                                conteudo = fs.readdirSync(subFullPath, { withFileTypes: true })
                                    .map(f => {
                                        if (f.isDirectory()) {
                                            return {
                                                nome: f.name,
                                                tipo: 'pasta'
                                            };
                                        } else {
                                            return {
                                                nome: f.name,
                                                tipo: 'arquivo'
                                            };
                                        }
                                    });
                            } catch (erro) {
                                console.warn(`Não foi possível ler ${subFullPath}: ${erro.message}`);
                            }
                            // Procura arquivo .jpg com nome numérico
                            const jpg = conteudo.find(arq => arq.tipo === 'arquivo' && /^\d+\.jpg$/.test(arq.nome));
                            const idSubpasta = jpg ? parseInt(jpg.nome) : null;
                            return {
                                id: idSubpasta,
                                nome: subitem.name,
                                arquivos: conteudo // inclui tudo: arquivos e subpastas
                            };
                        });
                } catch (erro) {
                    console.warn(`Não foi possível ler subpastas de ${fullPath}: ${erro.message}`);
                }
                return {
                    id: idGlobal++,
                    nome: item.name,
                    // FAZER: criar um slug a partir do nome
                    slug: item.name.toLowerCase().replace(/\s+/g, '-'),
                    // normaliza os nomes dos arquivos em animacoes para corresponder aos arquivos públicos
                    imgSrc: normalizeName(item.name) + '.jpg',
                    subpastas: subpastas
                };
            });
    });
}

// Debounce para evitar execuções múltiplas
let timeout;
function atualizarAnimacoesDebounced() {
    clearTimeout(timeout);
    timeout = setTimeout(atualizarAnimacoes, 1000);
}

// Função para atualizar o JSON com a estrutura de todas as pastas monitoradas
function atualizarAnimacoes() {
    const estrutura = gerarEstruturaPersonalizada(pastasParaMonitorar);
    let jsonAtual = {};
    try {
        if (fs.existsSync(arquivoSaida)) {
            jsonAtual = JSON.parse(fs.readFileSync(arquivoSaida, 'utf-8'));
        }
        jsonAtual.objAnimacoes = estrutura;
        jsonAtual.ultimaAtualizacao = new Date().toISOString();
        fs.writeFileSync(arquivoSaida, JSON.stringify(jsonAtual, null, 2));
        console.log(`Arquivo ${arquivoSaida} atualizado com sucesso!`);
    } catch (erro) {
        console.error('Erro ao atualizar animacoes.json:', erro.message);
    }
}

// Inicializa o watcher para monitorar mudanças em tempo real nas pastas específicas
const watcher = chokidar.watch(pastasParaMonitorar, {
    ignoreInitial: false,
    persistent: true,
    depth: 2
});
watcher.on('error', error => {
    console.warn('Erro ao monitorar:', error.message);
});
watcher.on('add', atualizarAnimacoesDebounced)
       .on('change', atualizarAnimacoesDebounced)
       .on('unlink', atualizarAnimacoesDebounced)
       .on('addDir', atualizarAnimacoesDebounced)
       .on('unlinkDir', atualizarAnimacoesDebounced);

console.log('Monitorando alterações em:', pastasParaMonitorar.join(', '));
