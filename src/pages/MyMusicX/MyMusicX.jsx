import { useState } from 'react';
import styles from './MyMusicX.module.css';
import notaFireMusical from '/mymusicx/NotaMusica.png';
import axios from 'axios';
import InputPadrao from '../../components/InputPadrao/InputPadrao';
import FieldsetPadrao from '../../components/FieldsetPadrao/FieldsetPadrao';
import LabelPadrao from '../../components/LabelPadrao/LabelPadrao';
import ButtonPadrao from '../../components/ButtonPadrao/ButtonPadrao';
import CardCD from '../../components/CardCD/CardCD';

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
            // Buscar releases do artista usando o proxy local (evita problemas de CORS)
            const searchUrl = 'http://localhost:4000/api/discogs/search';
            const searchParams = {
                artist: query,
                type: 'release',
            };
            const searchResp = await axios.get(searchUrl, { params: searchParams });
            console.log('Resposta busca releases:', searchResp.data);

            if (!searchResp.data.summary || searchResp.data.summary.Total === 0) {
                setError('Nenhum CD encontrado para este artista.');
                setIsLoading(false);
                return;
            }

            // Usar a resposta já filtrada e organizada pelo proxy
            setResults(searchResp.data);
        } catch (err) {
            console.error('Erro ao buscar discografia no Discogs: ', err);
            setError('Erro ao buscar no Discogs. Verifique o token ou a rede. ');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <>
            <header className={styles.headerContainerPgMusicx}>
                <h1>MyMusicX</h1>
                <br />
                <h2>Por hora estamos só buscando por artista no (Discogs)</h2>
            </header>
            <main className={styles.mainContainerPgMusicx}>
                <form className={styles.formBuscarCds} onSubmit={handleSearch}>
                    <FieldsetPadrao>
                        <LabelPadrao htmlFor='inputMyMusicx'>Buscar por Artista</LabelPadrao>
                        <InputPadrao
                            itId='inputMyMusicx'
                            itTipo="search"
                            itValue={query}
                            itOnChange={(e) => setQuery(e.target.value)}
                            itPlaceholder="Nome do artista (ex: Nirvana)"
                        />
                    </FieldsetPadrao>
                    <ButtonPadrao styleExterno={styles.btnBuscarDiscos} type="submit" >Buscar</ButtonPadrao>
                </form>

                {!discogsToken && (<p style={{ color: 'red' }}>
                    Atenção: nenhum token encontrado. Requisições sem autenticação são limitadas.
                </p>
                )}

                {isLoading && <p>Buscando...</p>}
                {error && <p style={{ color: 'red' }}>{error}</p>}

                {!results && <img className={styles.imgPgMusicx} src={notaFireMusical} alt='Imagem nota musical em chamas' />}
                
                {results && (
                    <section className={styles.sectionResultadosCds}>
                        <h4>Discografia de {results.artist}</h4>
                        
                        {/* Exibir categorias de resultados */}
                        {Object.entries(results.categories).map(([categoryName, items]) => (
                            items.length > 0 && (
                                <div key={categoryName} style={{ marginBottom: '2rem' }}>
                                    <h3>{categoryName} ({items.length})</h3>
                                    <div className={styles.divContainerCardsCds}>
                                        {items.map((r) => {
                                            const uniqueKey = r.master_id ? `m-${r.master_id}` : `t-${encodeURIComponent(r.title)}-y${r.year || ''}`;
                                            return (
                                                <CardCD
                                                    key={uniqueKey}
                                                    cdTitulo={r.title}
                                                    cdImgSrc={r.thumb}
                                                    cdAno={r.year}
                                                    cdVersions={r.versions}
                                                />
                                            );
                                        })}
                                    </div>
                                </div>
                            )
                        ))}
                    </section>
                )}
            </main>
        </>
    );
};

/*
Albums

Holocausto Urbano
12 versões
Zimbabwe Records
1991

Capa de Raio X Brasil - Liberdade De Expressão
Raio X Brasil - Liberdade De Expressão
8 versões
Zimbabwe Records
1993

Capa de Sobrevivendo No Inferno
Sobrevivendo No Inferno
18 versões
Cosa Nostra, Cosa Nostra
1997
...

*/
