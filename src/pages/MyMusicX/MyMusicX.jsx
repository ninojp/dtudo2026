import styles from './MyMusicX.module.css';
import notaFireMusical from '/NotaMusica.png';
export default function MyMusicX() {
    return (
        <main className={styles.mainContainerPgMusicx}>
            <img className={styles.imgPgMusicx} src={notaFireMusical} alt='Imagens nota musical em chamas' />
            <h1>MyMusicX</h1>
        </main>
    )
}
