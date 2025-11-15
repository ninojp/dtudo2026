import styles from './CardMyAnimes.module.css';
import { usePaginatedFetch } from '../../hooks/usePaginatedFetch';
import CampoBusca from '../CampoBusca/CampoBusca'; // Componente de busca genérico
import Pagination from '../Pagination/Pagination'; // Componente de paginação

export default function CardMyAnimes() {
    const {
        data: animacoes,
        isLoading,
        error,
        page,
        setPage,
        totalPages,
        searchTerm,
        setSearchTerm,
    } = usePaginatedFetch('/animacoes', 24);

    return (
        <>
            <CampoBusca
                searchTerm={searchTerm}
                onSearchChange={setSearchTerm}
                placeholder="Buscar por nome da animação..."
            />
            <p>Esta é uma seção para listar por ordem alfabetica todos as minhas animações.</p>

            {isLoading && <p>Carregando animações...</p>}
            {error && <p>Ocorreu um erro ao buscar as animações.</p>}

            <div className={styles.containerListaCardAnimacaoDiv}>
                {!isLoading && animacoes.map((animacao) => (
                    <article key={String(animacao.id)} className={styles.animacaoCardArticle}>
                        <h3>{animacao.nome}</h3>
                        <figure className={styles.figureImagemAnimacao}>
                            <img
                                className={styles.imgAnimacao}
                                src={animacao.imgSrc ? `/myanimes/${encodeURIComponent(String(animacao.imgSrc))}` : '/icone-editar.png'}
                                alt={`Capa do anime ${animacao.nome}`}
                            />
                        </figure>
                        <p>{animacao.id}</p>
                    </article>
                ))}
            </div>

            <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />
        </>
    );
};
