import styles from './CardsMyAnimesCompletList.module.css';
import { useState, useMemo, useCallback, useContext } from 'react';
import CampoBuscar from '../../CampoBuscar/CampoBuscar';
import PaginationButtons from '../../PaginationButtons/PaginationButtons';
import QtdExibirPorPage from '../../QtdExibirPorPage/QtdExibirPorPage';
import AnimesObjsListDetalhesContext from '../../../context_api/AnimesObjsListDetalhesContext/AnimesObjsListDetalhesContext';
import FiltrarPorGenero from '../../FiltrarPorGenero/FiltrarPorGenero';
import FiltrarPorLetra from '../../FiltrarPorLetra/FiltrarPorLetra';
import FiltrarPorAno from '../../FiltrarPorAno/FiltrarPorAno';
import CardAnime from '../CardAnime/CardAnime';

export default function CardsMyAnimesCompletList() {
    //Contexto, lista completa Animes (mal-id), json-server: http://localhost:3666/animesDetalhes 
    const { listObjsDetalhesAnimes, isLoading } = useContext(AnimesObjsListDetalhesContext);
    //Filtro por Gênero
    const [generoSelecionado, setGeneroSelecionado] = useState('');
    //Filtro por Letra
    const [letraSelecionada, setLetraSelecionada] = useState('');
    //Filtro por Ano
    const [anoSelecionado, setAnoSelecionado] = useState('');
    //Paginação
    const [page, setPage] = useState(1);
    const [limit, setLimit] = useState(48);
    //Busca
    const [searchTerm, setSearchTerm] = useState('');
    //Filtros combinados
    const filteredItems = useMemo(() => {
        let animesList = listObjsDetalhesAnimes;
        // Filtro por busca
        if (searchTerm) {
            animesList = animesList.filter(item =>
                String(item.title).toLowerCase().includes(searchTerm.toLowerCase())
            );
        };
        // Filtro por gênero os campos: genres, explicit_genres, themes, demographics
        if (generoSelecionado) {
            animesList = animesList.filter(anime =>
                anime.genres && anime.genres.some(g => g.name === generoSelecionado) ||
                anime.explicit_genres && anime.explicit_genres.some(g => g.name === generoSelecionado) ||
                anime.themes && anime.themes.some(t => t.name === generoSelecionado) ||
                anime.demographics && anime.demographics.some(d => d.name === generoSelecionado)
            );
        };
        // Filtro por letra inicial do título
        if (letraSelecionada) {
            animesList = animesList.filter(anime =>
                String(anime.title).toUpperCase().startsWith(letraSelecionada)
            );
        };
        // Filtro por ano
        if (anoSelecionado) {
            animesList = animesList.filter(anime => {
                const anoAnime = anime.year || (anime.aired && anime.aired.from && anime.aired.from.year);
                return String(anoAnime) === anoSelecionado;
            });
        };
        return animesList;
    }, [listObjsDetalhesAnimes, searchTerm, generoSelecionado, letraSelecionada, anoSelecionado]);
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
    if (isLoading) {
        return <div>Loading...</div>;
    }
    //=======================================================
    return (
        <main className={styles.mainCardsMyAnimesList}>
            <CampoBuscar onSearch={handleSearch} />
            <div className={styles.divPaginacaoEFiltro}>
                <div className={styles.divContainerFiltros}>
                    <h4>Filtrar por: </h4>
                    <FiltrarPorLetra letraSelecionada={letraSelecionada} setLetraSelecionada={setLetraSelecionada} />
                    <FiltrarPorGenero generoSelecionado={generoSelecionado} setGeneroSelecionado={setGeneroSelecionado} />
                    <FiltrarPorAno anoSelecionado={anoSelecionado} setAnoSelecionado={setAnoSelecionado} />
                </div>
                <QtdExibirPorPage
                    value={limit}
                    onChange={(newLimit) => { setLimit(newLimit); setPage(1); }}
                    options={[12, 24, 48, 96]}
                />
            </div>
            <div>
                {(searchTerm || generoSelecionado || letraSelecionada || anoSelecionado) && (
                    <span className={styles.spanTotalAnimes}>
                        <strong className={styles.strongTotalAnimes}>{filteredItems.length}</strong> Animes encontrados
                    </span>
                )}
            </div>
            <div className={styles.divContainerListaCardsMyaAnimes}>
                {paginatedItems?.map((animePg) => (
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
