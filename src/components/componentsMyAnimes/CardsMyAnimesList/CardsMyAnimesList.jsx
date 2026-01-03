import styles from './CardsMyAnimesList.module.css';
import { useState, useMemo, useCallback, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import CampoBuscar from '../../CampoBuscar/CampoBuscar';
import PaginationButtons from '../../PaginationButtons/PaginationButtons';
import QtdExibirPorPage from '../../QtdExibirPorPage/QtdExibirPorPage';
import ModalDialog from '../../ModalDialog/ModalDialog';
import CardMyAnimes from '../CardMyAnimes/CardMyAnimes';
import MyAnimesObjsListContext from '../../../context_api/MyAnimesObjsListContext/MyAnimesObjsListContext';
import AnimesObjsListDetalhesContext from '../../../context_api/AnimesObjsListDetalhesContext/AnimesObjsListDetalhesContext';
import FiltrarPorGenero from '../../FiltrarPorGenero/FiltrarPorGenero';

export default function CardsMyAnimesList() {
    const { listObjsMyAnimes } = useContext(MyAnimesObjsListContext);
    const navigate = useNavigate();
    const [page, setPage] = useState(1);
    const [limit, setLimit] = useState(48);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedItem, setSelectedItem] = useState(null);

    const filteredItems = useMemo(() => {
        if (!searchTerm) return listObjsMyAnimes;
        return listObjsMyAnimes.filter(item =>
            String(item.nome).toLowerCase().includes(searchTerm.toLowerCase())
        );
    }, [listObjsMyAnimes, searchTerm]);

    const totalPages = Math.max(1, Math.ceil(filteredItems.length / limit));

    const paginatedItems = useMemo(() => {
        const start = (page - 1) * limit;
        return filteredItems.slice(start, start + limit);
    }, [filteredItems, page, limit]);

    const handleSearch = useCallback((valor) => {
        setSearchTerm(valor);
        setPage(1);
    }, []);

    const handleImageClick = (item) => {
        // Se não houver subpastas, navega para a página de detalhes.
        if (!item.subpastas || item.subpastas.length === 0) {
            navigate(`/myanimes/myanimes-detalhes/${item.slug}`);
        } else {
            // Se houver uma ou mais subpastas, abre o modal.
            setSelectedItem(item);
        }
    };
    //===================================================================================
    // const { listObjsDetalhesAnimes, isLoading } = useContext(AnimesObjsListDetalhesContext);
    // const [generoSelecionado, setGeneroSelecionado] = useState('');

    // const generosUnicos = useMemo(() => {
    //     if (listObjsDetalhesAnimes.length > 0) {
    //         const allGenres = listObjsDetalhesAnimes.flatMap(anime => anime.genres || []);
    //         return [...new Set(allGenres.map(g => g.name))];
    //     }
    //     return [];
    // }, [listObjsDetalhesAnimes]);

    // const animesFiltrados = useMemo(() => {
    //     return generoSelecionado
    //         ? listObjsDetalhesAnimes.filter(anime =>
    //             anime.genres && anime.genres.some(g => g.name === generoSelecionado)
    //         )
    //         : [];
    // }, [listObjsDetalhesAnimes, generoSelecionado]);

    // if (isLoading) {
    //     return <div>Loading...</div>;
    // }
    //=======================================================
    return (
        <main className={styles.mainCardsMyAnimesList}>
            <CampoBuscar onSearch={handleSearch} />
            <QtdExibirPorPage
                value={limit}
                onChange={(newLimit) => { setLimit(newLimit); setPage(1); }}
                options={[12, 24, 48, 96]}
            />
            <FiltrarPorGenero />
            <div className={styles.divContainerListaCardsMyaAnimes}>
                {paginatedItems.map((item) => (
                    <CardMyAnimes
                        key={item.id}
                        item={item}
                        onImageClick={handleImageClick}
                    />
                ))}
            </div>
            <PaginationButtons
                currentPage={page}
                totalPages={totalPages}
                onPageChange={setPage}
            />
            {selectedItem && (<ModalDialog
                isOpen={!!selectedItem}
                onClose={() => setSelectedItem(null)}
                title={selectedItem.nome}
            >
                {selectedItem.subpastas && selectedItem.subpastas.map(item => (
                    <Link key={item.nome} to={`/myanimes/myanimes-detalhes/${selectedItem.slug}`} target='_blank'>
                        <p className={styles.pListMiniAnimes}>
                            <img className={styles.imgListMiniAnimes} src={`/myanimes/animes/${item.mal_id}.jpg`} alt={item.nomeSemAno} />
                            {item.nome}
                        </p>
                    </Link>
                ))}
            </ModalDialog>
            )}
        </main>
    );
};
