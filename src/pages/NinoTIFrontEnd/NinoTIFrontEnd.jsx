import LogoFronEnd from '../../components/Icons/LogoFronEnd';
import styles from './NinoTIFrontEnd.module.css';

export default function NinoTIFrontEnd() {
    return (
        <main className={styles.mainContainerPage}>
            <h1>Front End</h1>
            <LogoFronEnd largura={'300px'} altura={'300px'}/>
            <h2>Estudando T.I a 28 anos, trabalhando e vivendo dela há 15!</h2>
            <p>Minha idéia aqui é juntar e expor todos os Cursos, Formações, Certificados, Diplomas e afíns desta área para formar meu portfólio.</p>
            <div className={styles.divContainerAreasTI}>
                ICONES das areas...
            </div>
        </main>
    );
};
