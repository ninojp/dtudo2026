import styles from './CardsAnimexList.module.css';
import { use, useState, useMemo, useCallback } from 'react';
import { Link } from 'react-router-dom';
import CampoBuscar from '../CampoBuscar/CampoBuscar';
import AnimexObjsListContext from '../../context_api/AnimexObjsListContext/AnimexObjsListContext';
import PaginationButtons from '../PaginationButtons/PaginationButtons';
import QtdExibirPorPage from '../QtdExibirPorPage/QtdExibirPorPage';
import ModalDialog from '../ModalDialog/ModalDialog';
import CardAnimex from '../CardAnimex/CardAnimex';
import ParagrafoPage from '../ParagrafoPage/ParagrafoPage';

export default function CardsAnimexList() {
    const { listObjsAnimex } = use(AnimexObjsListContext);
    //----------------------------------
    const [page, setPage] = useState(1);
    const [limit, setLimit] = useState(24);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedItem, setSelectedItem] = useState(null); // Estado do modal centralizado

    // 2. Filtrar e paginar a lista do contexto no lado do cliente.
    const filteredItems = useMemo(() => {
        if (!searchTerm) return listObjsAnimex;
        return listObjsAnimex.filter(item =>
            String(item.nome).toLowerCase().includes(searchTerm.toLowerCase())
        );
    }, [listObjsAnimex, searchTerm]);
    //----------------------------------------------------------------------
    const totalPages = Math.max(1, Math.ceil(filteredItems.length / limit));
    //----------------------------------------------------------------------
    const paginatedItems = useMemo(() => {
        const start = (page - 1) * limit;
        return filteredItems.slice(start, start + limit);
    }, [filteredItems, page, limit]);
    //-------------------------------------------
    const handleSearch = useCallback((valor) => {
        setSearchTerm(valor);
        setPage(1); // Resetar para a primeira página ao buscar
    }, []);
    //----------------------------------
    const handleImageClick = (item) => {
        setSelectedItem(item);
    };
    //=============================================
    return (
        <main className={styles.mainCardsAnimexList}>
            <CampoBuscar onSearch={handleSearch} />
            <QtdExibirPorPage
                value={limit}
                onChange={(newLimit) => { setLimit(newLimit); setPage(1); }}
                options={[12, 24, 48, 96]}
                textoParagrafo='Esta é uma seção para listar em ordem alfabética minha coleção de Hentai!S.'
            />
            <div className={styles.divContainerCardsListAnimex}>
                {paginatedItems.map((item) => (
                    <CardAnimex
                        key={String(item.id)}
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
            {selectedItem && (
                <ModalDialog
                    isOpen={!!selectedItem}
                    onClose={() => setSelectedItem(null)}
                    title={selectedItem.nome}
                >
                    {selectedItem.subpastas && selectedItem.subpastas.map(item => (
                        <Link key={item.id} to={`/animex/animex-detalhes/${selectedItem.slug}`} target='_blank'>
                            <p className={styles.pListMiniAnimes}>
                                <img className={styles.imgListMiniAnimes} src={`/animex/animes/${item.id}.jpg`} alt={item.nomeSemAno} />
                                {item.nome}
                            </p>
                        </Link>
                    ))}
                </ModalDialog>
            )}
        </main>
    );
};
