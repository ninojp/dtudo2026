import { useContext, useMemo } from 'react';
import AnimesObjsListDetalhesContext from '../../context_api/AnimesObjsListDetalhesContext/AnimesObjsListDetalhesContext';
import styles from './FiltrarPorGenero.module.css';

export default function FiltrarPorGenero({ generoSelecionado, setGeneroSelecionado }) {
    const { listObjsDetalhesAnimes } = useContext(AnimesObjsListDetalhesContext);
    const generosUnicos = useMemo(() => {
        if (listObjsDetalhesAnimes.length > 0) {
            const allGenres = listObjsDetalhesAnimes.flatMap(anime => anime.genres || []);
            return [...new Set(allGenres.map(g => g.name))];
        }
        return [];
    }, [listObjsDetalhesAnimes]);
    //=======================================================
    return (
        <div className={styles.divContainerFiltroGenero}>
            <div className={styles.divFiltrarGenero}>
                <h4>Filtrar por Gênero</h4>
                <select className={styles.selectGenero}
                    value={generoSelecionado}
                    onChange={(e) => setGeneroSelecionado(e.target.value)}
                >
                    <option value="">Selecione um gênero</option>
                    {generosUnicos.map(genero => (
                        <option key={genero} value={genero}>
                            {genero}
                        </option>
                    ))}
                </select>
            </div>
        </div>
    );
};
