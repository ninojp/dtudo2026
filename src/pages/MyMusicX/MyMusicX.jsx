import { useState } from 'react';
import styles from './MyMusicX.module.css';
import notaFireMusical from '/mymusicx/NotaMusica.png';
import axios from 'axios';
import InputPadrao from '../../components/InputPadrao/InputPadrao';
import FieldsetPadrao from '../../components/FieldsetPadrao/FieldsetPadrao';
import LabelPadrao from '../../components/LabelPadrao/LabelPadrao';
import ButtonPadrao from '../../components/ButtonPadrao/ButtonPadrao';
import CardCD from '../../components/componentsMyMusicx/CardCD/CardCD';

export default function MyMusicX() {
    const [artistQuery, setArtistQuery] = useState('');
    const [artistSuggestions, setArtistSuggestions] = useState([]);
    const [selectedArtist, setSelectedArtist] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const [results, setResults] = useState(null);
    // Lê o token do Discogs a partir da variável de ambiente Vite
    const discogsToken = typeof import.meta !== 'undefined' ? import.meta.env.VITE_DISCOGS_TOKEN : undefined;
    //-------------------------------------------------------------------------------------------------------
    const handleArtistSearch = async (q) => {
        if (!q.trim()) {
            setArtistSuggestions([]);
            return;
        }
        try {
            const resp = await axios.get('http://localhost:4000/api/discogs/artists', { params: { q } });
            setArtistSuggestions(resp.data.artists);
        } catch (err) {
            console.error('Erro ao buscar artistas:', err);
            setArtistSuggestions([]);
        }
    };

    const selectArtist = (artist) => {
        setSelectedArtist(artist);
        setArtistQuery(artist.title);
        setArtistSuggestions([]);
        // Agora buscar releases
        handleSearch(artist);
    };

    const handleSearch = async (artist) => {
        setError(null);
        setResults(null);
        setIsLoading(true);
        try {
            const searchUrl = 'http://localhost:4000/api/discogs/search';
            const searchParams = {
                artistId: artist.id,
                artistName: artist.title,
            };
            const searchResp = await axios.get(searchUrl, { params: searchParams });
            console.log('Resposta busca releases:', searchResp.data);

            if (!searchResp.data.summary || searchResp.data.summary.Total === 0) {
                setError('Nenhum CD encontrado para este artista.');
                setIsLoading(false);
                return;
            }

            setResults(searchResp.data);
        } catch (err) {
            console.error('Erro ao buscar discografia no Discogs: ', err);
            setError('Erro ao buscar no Discogs. Verifique o token ou a rede. ');
        } finally {
            setIsLoading(false);
        }
    };

    const handleSave = async (data) => {
        console.log('Salvando dados para:', data.artist);
        try {
            const saveUrl = 'http://localhost:4000/api/discogs/save';
            await axios.post(saveUrl, {
                artist: data.artist,
                items: data.items
            });
            alert('Dados salvos com sucesso!');
        } catch (err) {
            console.error('Erro ao salvar dados:', err);
            alert('Erro ao salvar dados.');
        }
    };

    //=========================================================
    return (
        <>
            <header className={styles.headerContainerPgMusicx}>
                <h1>MyMusicX</h1>
                <br />
                <h2>Por hora estamos só buscando por artista no (Discogs)</h2>
            </header>
            <main className={styles.mainContainerPgMusicx}>
                <form className={styles.formBuscarCds} onSubmit={(e) => e.preventDefault()}>
                    <FieldsetPadrao>
                        <LabelPadrao htmlFor='inputArtist'>Buscar por Artista</LabelPadrao>
                        <InputPadrao
                            itId='inputArtist'
                            itTipo="search"
                            itValue={artistQuery}
                            itOnChange={(e) => {
                                setArtistQuery(e.target.value);
                                setSelectedArtist(null);
                                handleArtistSearch(e.target.value);
                            }}
                            itPlaceholder="Nome do artista (ex: Racionais)"
                        />
                        {artistSuggestions.length > 0 && (
                            <ul style={{ listStyle: 'none', padding: 0, border: '1px solid #ccc', maxHeight: '200px', overflowY: 'auto' }}>
                                {artistSuggestions.map((artist) => (
                                    <li key={artist.id} style={{ padding: '8px', cursor: 'pointer' }} onClick={() => selectArtist(artist)}>
                                        {artist.title}
                                    </li>
                                ))}
                            </ul>
                        )}
                    </FieldsetPadrao>
                </form>

                {!discogsToken && (<p style={{ color: 'red' }}>
                    Atenção: nenhum token encontrado. Requisições sem autenticação são limitadas.
                </p>
                )}

                {isLoading && <p>Buscando...</p>}
                {error && <p style={{ color: 'red' }}>{error}</p>}

                {!results && !selectedArtist && <img className={styles.imgPgMusicx} src={notaFireMusical} alt='Imagem nota musical em chamas' />}
                
                {results && (
                    <section className={styles.sectionResultadosCds}>
                        <div className={styles.divContainerBtnSalvar}>
                            <h4>Discografia de {results.artist} ({results.summary.Total} itens)</h4>
                            <ButtonPadrao 
                                styleExterno={styles.btnSalvarDados} 
                                onClick={() => handleSave(results)}
                            >
                                Salvar Dados do Artista
                            </ButtonPadrao>
                        </div>
                        <div className={styles.divContainerCardsCds}>
                            {results.items.map((r, index) => {
                                const uniqueKey = `${r.id}-${index}`;
                                return (
                                    <CardCD
                                        key={uniqueKey}
                                        cdTitulo={r.title}
                                        cdImgSrc={r.thumb}
                                        cdAno={r.year}
                                    />
                                );
                            })}
                        </div>
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
