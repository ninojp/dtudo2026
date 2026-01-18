import { useState } from 'react';
import styles from './MyMusicX.module.css';
import notaFireMusical from '/mymusicx/NotaMusica.png';
import axios from 'axios';
import InputPadrao from '../../components/InputPadrao/InputPadrao';
import FieldsetPadrao from '../../components/FieldsetPadrao/FieldsetPadrao';
import LabelPadrao from '../../components/LabelPadrao/LabelPadrao';
import ButtonPadrao from '../../components/ButtonPadrao/ButtonPadrao';
import CardCD from '../../components/componentsMyMusicx/CardCD/CardCD';
import Spinner from '../../components/Spinner/Spinner';

export default function MyMusicX() {
    const [artistQuery, setArtistQuery] = useState('');
    const [artistSuggestions, setArtistSuggestions] = useState([]);
    const [selectedArtist, setSelectedArtist] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const [results, setResults] = useState(null); // Simplified state

    // Simplified filters
    const [filters, setFilters] = useState({
        hasThumb: false,
        hasYear: false,
    });

    // Lê o token do Discogs a partir da variável de ambiente Vite
    const discogsToken = typeof import.meta !== 'undefined' ? import.meta.env.VITE_DISCOGS_TOKEN : undefined;
    //-------------------------------------------------------------------------------------------------------
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
                setResults(null);
                setIsLoading(false);
                return;
            }

            setResults(searchResp.data); // Use single state
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
            // We need to save the original unfiltered items
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

    // Helper function to render a category with active filters
    const renderCategory = (category, title) => {
        if (!results || !category || category.count === 0) return null;

        const filteredItems = category.items.filter(item => {
            if (filters.hasThumb && !item.thumb) return false;
            if (filters.hasYear && !item.year) return false;
            return true;
        });

        if (filteredItems.length === 0) return null;

        return (
            <div className={styles.divCategoryGroup}>
                <h3>{title} ({filteredItems.length})</h3>
                <div className={styles.divContainerCardsCds}>
                    {filteredItems.map((r, index) => (
                        <CardCD
                            key={`${r.id}-${index}`}
                            cdTitulo={r.title}
                            cdArtist={r.artist}
                            cdImgSrc={r.thumb}
                            cdAno={r.year}
                        />
                    ))}
                </div>
            </div>
        );
    };

    // Calculate total displayed items after filtering
    let totalDisplayed = 0;
    if (results && results.summary.categories) {
        Object.values(results.summary.categories).forEach(category => {
            totalDisplayed += category.items.filter(item => {
                if (filters.hasThumb && !item.thumb) return false;
                if (filters.hasYear && !item.year) return false;
                return true;
            }).length;
        });
    }

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

                {isLoading && <Spinner />}
                {error && <p style={{ color: 'red' }}>{error}</p>}
                {!results && !selectedArtist && <img className={styles.imgPgMusicx} src={notaFireMusical} alt='Imagem nota musical em chamas' />}

                {results && (
                    <section className={styles.sectionFiltros}>
                        <fieldset className={styles.fieldsetFiltros}>
                            <legend>Filtros</legend>
                            {/* Simplified filters UI */}
                            <div>
                                <input type="checkbox" id="hasThumb" name="hasThumb" checked={filters.hasThumb} onChange={handleFilterChange} />
                                <label htmlFor="hasThumb">Com Capa</label>
                                <input type="checkbox" id="hasYear" name="hasYear" checked={filters.hasYear} onChange={handleFilterChange} />
                                <label htmlFor="hasYear">Com Ano</label>
                            </div>
                        </fieldset>
                    </section>
                )}

                {results && (
                    <section className={styles.sectionResultadosCds}>
                        <div className={styles.divContainerBtnSalvar}>
                            <h4>Discografia de {results.artist} ({totalDisplayed} de {results.summary.Total} lançamentos exibidos)</h4>
                            {results.summary.categories && (
                                <div className={styles.divCategoriasResumo}>
                                    {/* Display original counts from backend */}
                                    {results.summary.categories.albums.count > 0 && (
                                        <span className={styles.spanCategoria}>{results.summary.categories.albums.count} - Álbuns | </span>
                                    )}
                                    {results.summary.categories.singlesEPs.count > 0 && (
                                        <span className={styles.spanCategoria}>{results.summary.categories.singlesEPs.count} - Singles & EPs | </span>
                                    )}
                                    {results.summary.categories.compilations.count > 0 && (
                                        <span className={styles.spanCategoria}>{results.summary.categories.compilations.count} - Compilações | </span>
                                    )}
                                    {results.summary.categories.videos.count > 0 && (
                                        <span className={styles.spanCategoria}>{results.summary.categories.videos.count} - Vídeos</span>
                                    )}
                                </div>
                            )}
                            <ButtonPadrao
                                styleExterno={styles.btnSalvarDados}
                                onClick={() => handleSave(results)}
                            >
                                Salvar Dados do Artista
                            </ButtonPadrao>
                        </div>

                        {/* Render using the helper function */}
                        {renderCategory(results.summary.categories.albums, 'Álbuns')}
                        {renderCategory(results.summary.categories.singlesEPs, 'Singles & EPs')}
                        {renderCategory(results.summary.categories.compilations, 'Compilações')}
                        {renderCategory(results.summary.categories.videos, 'Vídeos')}
                    </section>
                )}
            </main>
        </>
    );
};
