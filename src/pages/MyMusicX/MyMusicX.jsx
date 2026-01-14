import { useState, useEffect } from 'react';
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
    const [allResults, setAllResults] = useState(null);
    const [filteredResults, setFilteredResults] = useState(null);

    const [filters, setFilters] = useState({
        showMasters: true,
        showReleases: true,
        hasThumb: false,
        hasYear: false,
        isAlbum: true,
        isSingle: true,
        isCompilation: true,
    });

    // Lê o token do Discogs a partir da variável de ambiente Vite
    const discogsToken = typeof import.meta !== 'undefined' ? import.meta.env.VITE_DISCOGS_TOKEN : undefined;
    //-------------------------------------------------------------------------------------------------------

    useEffect(() => {
        if (!allResults || !selectedArtist) {
            setFilteredResults(null);
            return;
        }

        let filteredItems = allResults.items.filter(item => {
            // Filtro automático de artista: exibe apenas itens do artista selecionado.
            // Usamos 'includes' para abranger colaborações (ex: "Artista A & Artista B").
            if (!item.artist || !item.artist.toLowerCase().includes(selectedArtist.title.toLowerCase())) {
                return false;
            }

            // Filtro de tipo (master/release)
            if (!filters.showMasters && item.type === 'master') {
                return false;
            }
            if (!filters.showReleases && item.type === 'release') {
                return false;
            }
            // Filtro de "tem capa"
            if (filters.hasThumb && !item.thumb) {
                return false;
            }
            // Filtro de "tem ano"
            if (filters.hasYear && !item.year) {
                return false;
            }

            const formatDescriptions = (Array.isArray(item.formats)
                ? item.formats.flatMap(f => f.descriptions || []).join(' ')
                : ''
            ).toLowerCase();

            const isAlbum = formatDescriptions.includes('album');
            const isSingle = formatDescriptions.includes('single');
            const isCompilation = formatDescriptions.includes('compilation');

            if (!filters.isAlbum && isAlbum) return false;
            if (!filters.isSingle && isSingle) return false;
            if (!filters.isCompilation && isCompilation) return false;

            return true;
        });

        setFilteredResults({
            ...allResults,
            items: filteredItems,
            summary: { Total: filteredItems.length },
        });

    }, [filters, allResults, selectedArtist]);


    const handleFilterChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFilters(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

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
        setAllResults(null);
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
                setAllResults(null);
                setIsLoading(false);
                return;
            }

            setAllResults(searchResp.data);
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
                            <ul className={styles.listaSuspencaArtistas} >
                                {artistSuggestions.map((artist) => (
                                    <li key={artist.id}  className={styles.liSuspencaArtistas} onClick={() => selectArtist(artist)}>
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
                {!filteredResults && !selectedArtist && <img className={styles.imgPgMusicx} src={notaFireMusical} alt='Imagem nota musical em chamas' />}

                {filteredResults && (
                    <section className={styles.sectionFiltros}>
                        <fieldset className={styles.fieldsetFiltros}>
                            <legend>Filtros</legend>
                            <div>
                                <input type="checkbox" id="showMasters" name="showMasters" checked={filters.showMasters} onChange={handleFilterChange} />
                                <label htmlFor="showMasters">Masters</label>
                                <input type="checkbox" id="showReleases" name="showReleases" checked={filters.showReleases} onChange={handleFilterChange} />
                                <label htmlFor="showReleases">Releases</label>
                            </div>
                            <div>
                                <input type="checkbox" id="isAlbum" name="isAlbum" checked={filters.isAlbum} onChange={handleFilterChange} />
                                <label htmlFor="isAlbum">Álbuns</label>
                                <input type="checkbox" id="isSingle" name="isSingle" checked={filters.isSingle} onChange={handleFilterChange} />
                                <label htmlFor="isSingle">Singles</label>
                                <input type="checkbox" id="isCompilation" name="isCompilation" checked={filters.isCompilation} onChange={handleFilterChange} />
                                <label htmlFor="isCompilation">Compilações</label>
                            </div>
                            <div>
                                <input type="checkbox" id="hasThumb" name="hasThumb" checked={filters.hasThumb} onChange={handleFilterChange} />
                                <label htmlFor="hasThumb">Com Capa</label>
                                <input type="checkbox" id="hasYear" name="hasYear" checked={filters.hasYear} onChange={handleFilterChange} />
                                <label htmlFor="hasYear">Com Ano</label>
                            </div>
                        </fieldset>
                    </section>
                )}

                {filteredResults && (
                    <section className={styles.sectionResultadosCds}>
                        <div className={styles.divContainerBtnSalvar}>
                            <h4>Discografia de {filteredResults.artist} ({filteredResults.summary.Total} itens)</h4>
                            <ButtonPadrao
                                styleExterno={styles.btnSalvarDados}
                                onClick={() => handleSave(filteredResults)}
                            >
                                Salvar Dados do Artista
                            </ButtonPadrao>
                        </div>
                        <div className={styles.divContainerCardsCds}>
                            {filteredResults.items.map((r, index) => {
                                const uniqueKey = `${r.id}-${index}`;
                                return (
                                    <CardCD
                                        key={uniqueKey}
                                        cdTitulo={r.title}
                                        cdArtist={r.artist}
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
