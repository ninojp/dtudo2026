import styles from './AsideNinoTIPage.module.css';

export default function AsideNinoTIPage() {
    return (
        <aside className={styles.asideMenuAreasTI}>
            <nav className={styles.navMenuAreasTI}>
                <ul className={styles.ulMenuAreasTI}>
                    <li className={styles.menuProgramacao} id="1">Programação</li>
                    <li className={styles.menuFrontEnd} id="2">Front-End</li>
                    <li className={styles.menuCyberSecurity} id="3">Cyber Security</li>
                    <li className={styles.menuDesignEUX} id="4">Design e UX</li>
                    <li className={styles.menuOS} id="5">O.S</li>
                    <li className={styles.menuBlockchainECriptoAtivos} id="6">Blockchain</li>
                    <li className={styles.menuHardware} id="7">Hardware</li>
                    <li className={styles.menuRedes} id="8">Redes</li>
                    <li className={styles.menuDataScience} id="9">Data Science</li>
                    <li className={styles.menuInteligenciaArtificial} id="10">I.A</li>
                </ul>
            </nav>
        </aside>
    )
}
