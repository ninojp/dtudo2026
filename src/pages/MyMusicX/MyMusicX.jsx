import { useState } from 'react';
import styles from './MyMusicX.module.css';
import notaFireMusical from '/mymusicx/NotaMusica.png';
import axios from 'axios';

export default function MyMusicX() {
    const [query, setQuery] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const [results, setResults] = useState(null);

    // Leia o token do Discogs a partir da variável de ambiente Vite
    const discogsToken = typeof import.meta !== 'undefined' ? import.meta.env.VITE_DISCOGS_TOKEN : undefined;
    //-------------------------------------------------------------------------------------------------------
    const handleSearch = async (e) => {
        e.preventDefault();
        setError(null);
        setResults(null);
        if (!query || query.trim().length === 0) {
            setError('Informe o nome do artista para buscar.');
            return;
        }
        // Iniciar a busca
        setIsLoading(true);
        try {
            const headers = {};
            if (discogsToken) headers['Authorization'] = `Discogs token=${discogsToken}`;
            
            // Buscar releases do artista usando /database/search com type=release
            const searchUrl = 'https://api.discogs.com/database/search';
            const searchParams = {
                artist: query,
                type: 'release',
                per_page: 50,
                page: 1,
            };
            const searchResp = await axios.get(searchUrl, { params: searchParams, headers });
            console.log('Resposta busca releases:', searchResp.data);
            
            if (!searchResp.data.results || searchResp.data.results.length === 0) {
                setError('Nenhum CD encontrado para este artista.');
                setIsLoading(false);
                return;
            }
            
            // Filtrar e mapear os releases para pegar apenas os com thumb (capa)
            const filteredReleases = searchResp.data.results
                .filter(r => r.thumb && r.title && r.year)
                .map(r => ({
                    id: r.id,
                    title: r.title,
                    year: r.year,
                    thumb: r.thumb,
                    uri: r.uri,
                    type: r.type,
                }))
                .sort((a, b) => a.year - b.year); // Ordenar por ano
            
            // Pegar o nome do artista do primeiro resultado
            const artistName = searchResp.data.results[0].title ? searchResp.data.results[0].title.split(' - ')[0] : query;
            
            setResults({
                artist: artistName,
                releases: filteredReleases,
                totalCount: filteredReleases.length,
            });
        } catch (err) {
            console.error('Erro ao buscar discografia no Discogs: ', err);
            setError('Erro ao buscar no Discogs. Verifique o token ou a rede. ');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <main className={styles.mainContainerPgMusicx}>
            <img className={styles.imgPgMusicx} src={notaFireMusical} alt='Imagem nota musical em chamas' />
            <h1>MyMusicX</h1>

            <section className={styles.apiContent}>
                <h2>Busca de Artista (Discogs)</h2>

                <form onSubmit={handleSearch} style={{ marginBottom: 12 }}>
                    <input
                        type="text"
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        placeholder="Nome do artista (ex: Nirvana)"
                        style={{ padding: 8, width: '60%' }}
                    />
                    <button type="submit" style={{ marginLeft: 8, padding: '8px 12px' }}>Buscar</button>
                </form>

                {!discogsToken && (
                    <p style={{ color: '#b35' }}>
                        Atenção: nenhum token encontrado. Requisições sem autenticação são limitadas.
                    </p>
                )}

                {isLoading && <p>Buscando...</p>}
                {error && <p style={{ color: 'red' }}>{error}</p>}

                {results && (
                    <div>
                        <h3>Discografia de {results.artist} ({results.totalCount} CDs)</h3>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))', gap: '16px' }}>
                            {results.releases && results.releases.length > 0 ? (
                                results.releases.map((r) => (
                                    <div key={r.id} style={{ textAlign: 'center', border: '1px solid #ccc', padding: '8px', borderRadius: '4px' }}>
                                        {r.thumb && (
                                            <img src={r.thumb} alt={r.title} style={{ maxHeight: '120px', marginBottom: '8px', borderRadius: '4px' }} />
                                        )}
                                        <p style={{ fontWeight: 'bold', fontSize: '0.9em', margin: '4px 0' }}>{r.title}</p>
                                        {r.year && <p style={{ fontSize: '0.8em', color: '#666', margin: '4px 0' }}>Ano: {r.year}</p>}
                                    </div>
                                ))
                            ) : (
                                <p>Nenhum CD encontrado para este artista.</p>
                            )}
                        </div>
                    </div>
                )}
            </section>
        </main>
    )
}
