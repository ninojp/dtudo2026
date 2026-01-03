import { useContext, useState, useMemo } from 'react';
import AnimesObjsListDetalhesContext from '../../context_api/AnimesObjsListDetalhesContext/AnimesObjsListDetalhesContext';
import styles from './FiltrarPorGenero.module.css';
import CardAnime from '../componentsMyAnimes/CardAnime/CardAnime';

export default function FiltrarPorGenero() {
    const { listObjsDetalhesAnimes, isLoading } = useContext(AnimesObjsListDetalhesContext);
    const [generoSelecionado, setGeneroSelecionado] = useState('');

    const generosUnicos = useMemo(() => {
        if (listObjsDetalhesAnimes.length > 0) {
            const allGenres = listObjsDetalhesAnimes.flatMap(anime => anime.genres || []);
            return [...new Set(allGenres.map(g => g.name))];
        }
        return [];
    }, [listObjsDetalhesAnimes]);

    const animesFiltrados = useMemo(() => {
        const filtered = generoSelecionado
            ? listObjsDetalhesAnimes.filter(anime =>
                anime.genres && anime.genres.some(g => g.name === generoSelecionado)
            )
            : [];
        
        // Ordenar alfabeticamente por nome
        return filtered.sort((a, b) => {
            const nomeA = (a.nome || a.title || '').toLowerCase();
            const nomeB = (b.nome || b.title || '').toLowerCase();
            return nomeA.localeCompare(nomeB);
        });
    }, [listObjsDetalhesAnimes, generoSelecionado]);

    if (isLoading) {
        return <div>Loading...</div>;
    }

    return (
        <div className={styles.divContainerFiltroGenero}>
            <div className={styles.divFiltrarGenero}>
                <h4>Filtrar por Gênero</h4>
                <select
                    value={generoSelecionado}
                    onChange={(e) => setGeneroSelecionado(e.target.value)}
                >
                    <option value="">Selecione Gênero</option>
                    {generosUnicos.map(genero => (
                        <option key={genero} value={genero}>
                            {genero}
                        </option>
                    ))}
                </select>
            </div>
            {generoSelecionado && (
                <span className={styles.spanTotalAnimes}>
                    <strong className={styles.strongTotalAnimes}>{animesFiltrados.length}</strong> Animes encontrados
                </span>
            )}
            <div className={styles.divContainerAnimesLista}>
                {animesFiltrados.map(anime => <CardAnime key={anime.mal_id} anime={anime} />)}
            </div>
        </div>
    );
};

//==========================================================
// {animesFiltrados.map(anime => (
//     <div key={anime.mal_id || anime.id} style={{display: 'flex', alignItems: 'center', border: '1px solid #ccc', margin: '10px', padding: '10px' }}>
//         <img src={anime.images.webp.image_url || anime.image} alt={anime.title || anime.nome} style={{ width: '100px', height: '150px' }} />
//         <div style={{ marginLeft: '10px' }}>
//             <h3>{anime.title || anime.nome}</h3>
//             <p>Gêneros: {anime.genres ? anime.genres.map(g => g.name).join(', ') : 'N/A'}</p>
//         </div>
//     </div>
// ))}
