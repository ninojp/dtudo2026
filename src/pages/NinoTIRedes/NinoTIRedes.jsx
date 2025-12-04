import LogoRede from '../../components/componentsNinoTI/areasTI/LogoRede';
import styles from './NinoTIRedes.module.css';

export default function NinoTIRedes() {
    return (
        <main className={styles.mainContainerPage}>
            <h1>Redes de Computadores</h1>
            <LogoRede largura={'500px'} altura={'200px'}/>
            <h2>Breve descrição sobre a area...</h2>
            <p>Mais detalhes sobre a area...</p>
            <div className={styles.divContainerAreasTI}>
                ICONES da area...
            </div>
        </main>
    );
};
