import { use } from 'react';
import styles from './CardMyAnimesMini.module.css';
import MyAnimesDetalhesContext from '../../context_api/MyAnimesDetalhesContext/MyAnimesDetalhesContext';

export default function CardMyAnimesMini() {
    const { myAnimesDetalhes, currentDisplayId, setCurrentDisplayId } = use(MyAnimesDetalhesContext);
    return (
        <div className={styles.divContainerBtnsCarrossel}>
            {myAnimesDetalhes.subpastas.map((subpasta) => (
                <button
                    key={subpasta.id}
                    className={`${styles.btnCarrosselItem} ${currentDisplayId === subpasta.id ? styles.active : ''}`}
                    onClick={() => setCurrentDisplayId(subpasta.id)}
                >
                    <span className={styles.spanTextCarrossel}>{subpasta.ano}</span>
                    <img className={styles.imgMiniAnimeBtnCarrossel} src={`/myanimes/animes/${subpasta.id}.jpg`} />
                    <span className={styles.spanTextCarrossel}>{subpasta.nomeSemAno}</span>
                </button>
            ))}
        </div>
    )
}
