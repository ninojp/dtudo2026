import { use } from 'react';
import styles from './CardMiniAnime.module.css';
import AnimexDetalhesContext from '../../contextAPI/AnimexDetalhesProvider/AnimexDetalhesContext';

export default function CardMiniAnime() {
    const { animexDetalhes, currentDisplayId, setCurrentDisplayId } = use(AnimexDetalhesContext);

    return (
        <div className={styles.divContainerBtnsCarrossel}>
            {animexDetalhes.subpastas.map((subpasta) => (
                <button
                    key={subpasta.id}
                    className={`${styles.btnCarrosselItem} ${currentDisplayId === subpasta.id ? styles.active : ''}`}
                    onClick={() => setCurrentDisplayId(subpasta.id)}
                >
                    <span className={styles.spanTextCarrossel}>{subpasta.ano}</span>
                    <img className={styles.imgMiniAnimeBtnCarrossel} src={`/animes/${subpasta.id}.jpg`} />
                    <span className={styles.spanTextCarrossel}>{subpasta.nomeSemAno}</span>
                </button>
            ))}
        </div>
    )
}
