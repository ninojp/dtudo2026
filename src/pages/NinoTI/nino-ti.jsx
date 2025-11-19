import AsideNinoTIPage from '../../components/AsideNinoTIPage/AsideNinoTIPage';
import styles from './NinoTI.module.css';

export default function NinoTI() {
    return (
        <div className={styles.divContainerPgNinoTI}>
            <AsideNinoTIPage />
            <main>
                <section className={styles.sectionContainerPg}>
                    <h2>Estudando T.I a 28 anos, trabalhando e vivendo dela há 15!</h2>
                    <p>Minha idéia aqui é juntar e expor todos os Cursos, Formações, Certificados, Diplomas e afíns do
                        meu portfólio.</p>
                    <div className={styles.divContainerAreasTI}>
                        ICONES das areas...
                    </div>
                </section>
            </main>
        </div>
    );
};
