import styles from './MyMusicX.module.css';
import notaFireMusical from '/mymusicx/NotaMusica.png';
export default function MyMusicX() {
    return (
        <main className={styles.mainContainerPgMusicx}>
            <img className={styles.imgPgMusicx} src={notaFireMusical} alt='Imagem nota musical em chamas' />
            <h1>MyMusicX</h1>
        </main>
    )
}
