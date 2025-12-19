import fs from 'fs';
import axios from 'axios';

const ANIMACOES_FILE = './api/db/animacoes.json';
const JIKAN_BASE_URL = 'https://api.jikan.moe/v4/anime';
// Limite para teste (mude para um número maior ou remova para processar tudo)
const LIMIT = 2; // Processa apenas os primeiros LIMIT animes de cada coleção
// Função para buscar detalhes de um anime
async function fetchAnimeDetails(malId) {
    try {
        const response = await axios.get(`${JIKAN_BASE_URL}/${malId}/full`);
        return response.data.data;
    } catch (error) {
        console.error(`Erro ao buscar detalhes para ID ${malId}:`, error.message);
        return null;
    }
}
// Função para adicionar delay entre requests (1 segundo para respeitar rate limit)
function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}
// Função principal
async function populateAnimeDetails() {
    // Ler o arquivo JSON
    const data = JSON.parse(fs.readFileSync(ANIMACOES_FILE, 'utf8'));
    let totalProcessados = 0;
    // Iterar sobre cada animação
    for (const animacao of data.animacoes) {
        console.log(`Processando coleção: ${animacao.nome}`);
        // Iterar sobre cada subpasta (anime), limitado
        for (const subpasta of animacao.subpastas) { //.slice(0, LIMIT) Limita aos primeiros LIMIT
            if (!subpasta.detalhes) { // Só buscar se não tiver detalhes
                console.log(`Buscando detalhes para: ${subpasta.nome} (ID: ${subpasta.id})`);
                const detalhes = await fetchAnimeDetails(subpasta.id);
                if (detalhes) {
                    subpasta.detalhes = detalhes;
                    console.log(`Detalhes salvos para: ${subpasta.nome}`);
                    totalProcessados++;
                } else {
                    console.log(`Falha ao buscar detalhes para: ${subpasta.nome}`);
                }
                // Delay de 1 segundo entre requests
                await delay(1000);
            } else {
                console.log(`Detalhes já existem para: ${subpasta.nome}`);
            }
        }
    }
    // Salvar o arquivo atualizado
    fs.writeFileSync(ANIMACOES_FILE, JSON.stringify(data, null, 2));
    console.log(`Processo concluído. ${totalProcessados} animes processados. Arquivo atualizado.`);
}
populateAnimeDetails().catch(console.error);
