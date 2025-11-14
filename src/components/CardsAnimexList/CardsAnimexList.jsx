import styles from './CardsAnimexList.module.css';
import { use, useState, useMemo, useCallback } from 'react';
import { Link } from 'react-router-dom';
import CampoBuscar from '../CampoBuscar/CampoBuscar';
import AnimexObjsListContext from '../../contextAPI/AnimexObjsListProvider/AnimexObjsListContext';
import PaginationButtons from '../PaginationButtons/PaginationButtons';
import PageQtdExibir from '../PageQtdExibir/PageQtdExibir';
import ModalDialog from '../ModalDialog/ModalDialog';
import CardAnimex from '../CardAnimex/CardAnimex';

export default function CardsAnimexList() {
    const { listObjsAnimex } = use(AnimexObjsListContext);
    //----------------------------------
    const [page, setPage] = useState(1);
    const [limit, setLimit] = useState(96);
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
        <main>
            <section className={styles.containerFlex}>
                <CampoBuscar onSearch={handleSearch} />
                <p>Esta é uma seção para listar em ordem alfabética minha coleção de Hentai!S.</p>
                <PageQtdExibir
                    value={limit}
                    onChange={(newLimit) => { setLimit(newLimit); setPage(1); }}
                    options={[6, 12, 24, 48, 96]}
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
                            <Link key={item.id} to={`/animex-detalhes/${selectedItem.slug}`} target='_blank'>
                                <p className={styles.pListMiniAnimes}>
                                    <img className={styles.imgListMiniAnimes} src={`/animes/${item.id}.jpg`} alt={item.nomeSemAno} />
                                    {item.nome}
                                </p>
                            </Link>
                        ))}
                    </ModalDialog>
                )}
            </section>
        </main>
    );
};
