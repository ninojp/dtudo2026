import styles from './CardsMyAnimesCompletList.module.css';
import { useState, useMemo, useCallback, useContext } from 'react';
import CampoBuscar from '../../CampoBuscar/CampoBuscar';
import PaginationButtons from '../../PaginationButtons/PaginationButtons';
import QtdExibirPorPage from '../../QtdExibirPorPage/QtdExibirPorPage';
import AnimesObjsListDetalhesContext from '../../../context_api/AnimesObjsListDetalhesContext/AnimesObjsListDetalhesContext';
import FiltrarPorGenero from '../../FiltrarPorGenero/FiltrarPorGenero';
import CardAnime from '../CardAnime/CardAnime';

export default function CardsMyAnimesCompletList() {
    //Contexto, lista completa Animes (mal-id), json-server: http://localhost:3666/animesDetalhes 
    const { listObjsDetalhesAnimes, isLoading } = useContext(AnimesObjsListDetalhesContext);
    //Filtro por Gênero
    const [generoSelecionado, setGeneroSelecionado] = useState('');
    //Paginação
    const [page, setPage] = useState(1);
    const [limit, setLimit] = useState(48);
    //Busca
    const [searchTerm, setSearchTerm] = useState('');
    const filteredItems = useMemo(() => {
        if (!searchTerm) return listObjsDetalhesAnimes;
        return listObjsDetalhesAnimes.filter(item =>
            String(item.title).toLowerCase().includes(searchTerm.toLowerCase())
        );
    }, [listObjsDetalhesAnimes, searchTerm]);
    //Paginação
    const totalPages = Math.max(1, Math.ceil(filteredItems.length / limit));
    const paginatedItems = useMemo(() => {
        const start = (page - 1) * limit;
        return filteredItems.slice(start, start + limit);
    }, [filteredItems, page, limit]);
    //Função de busca
    const handleSearch = useCallback((valor) => {
        setSearchTerm(valor);
        setPage(1);
    }, []);

    // Geração de gêneros únicos para o filtro
    const generosUnicos = useMemo(() => {
        if (listObjsDetalhesAnimes.length > 0) {
            const allGenres = listObjsDetalhesAnimes.flatMap(anime => anime.genres || []);
            return [...new Set(allGenres.map(g => g.name))];
        }
        return [];
    }, [listObjsDetalhesAnimes]);
    // Filtragem dos animes com base no gênero selecionado
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
    //=======================================================
    return (
        <main className={styles.mainCardsMyAnimesList}>
            <CampoBuscar onSearch={handleSearch} />
            <QtdExibirPorPage
                value={limit}
                onChange={(newLimit) => { setLimit(newLimit); setPage(1); }}
                options={[12, 24, 48, 96]}
            />
            <FiltrarPorGenero generoSelecionado={generoSelecionado} setGeneroSelecionado={setGeneroSelecionado} />
            {generoSelecionado && (
                <span className={styles.spanTotalAnimes}>
                    <strong className={styles.strongTotalAnimes}>{animesFiltrados.length}</strong> Animes encontrados
                </span>
            )}
            <div className={styles.divContainerAnimesLista}>
                {animesFiltrados.map(anime => <CardAnime key={anime.mal_id} anime={anime} />)}
            </div>
            <div className={styles.divContainerListaCardsMyaAnimes}>
                {paginatedItems && paginatedItems.map((animePg) => (
                    <CardAnime
                        key={animePg.mal_id}
                        anime={animePg}
                    />
                ))}
            </div>
            <PaginationButtons
                currentPage={page}
                totalPages={totalPages}
                onPageChange={setPage}
            />
        </main>
    );
};
