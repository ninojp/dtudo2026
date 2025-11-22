import { Link } from 'react-router-dom';
import LogoFronEnd from '../Icons/LogoFronEnd';
import styles from './AsideNinoTIPage.module.css';
import LogoProgramacao from '../Icons/LogoProgramacao';
import LogoCyberSecurity from '../Icons/LogoCyberSecurity';
import LogoBlockchain from '../Icons/LogoBlockchain';
import LogoIA from '../Icons/LogoIA';
import LogoHardware from '../Icons/logoHardware';
import LogoOS from '../Icons/LogoOS';
import LogoRede from '../Icons/LogoRede';
import LogoDataScience from '../Icons/LogoDataScience';
import LogoDesignUx from '../Icons/LogoDesignUx';
import LogoDevops from '../Icons/LogoDevops';

export default function AsideNinoTIPage() {
    return (
        <aside className={styles.asideMenuAreasTI}>
            <ul className={styles.ulMenuAreasTI}>
                <Link className={styles.linkMenuAreasTI} to={'/ninoti/front-end'} >
                    <li className={styles.menuFrontEnd} id="2">
                        Front-End
                        <LogoFronEnd largura={'30px'} altura={'30px'} />
                    </li>
                </Link>
                <Link className={styles.linkMenuAreasTI} to={'/ninoti/programacao'} >
                    <li className={styles.menuBackEnd} id="1">
                        Programação
                        <LogoProgramacao largura={'30px'} altura={'30px'} />
                    </li>
                </Link>
                <Link className={styles.linkMenuAreasTI} to={'/ninoti/cyber-security'} >
                    <li className={styles.menuCyberSecurity} id="3">
                        Cyber Security
                        <LogoDevops largura={'30px'} altura={'30px'} />
                    </li>
                </Link>
                <Link className={styles.linkMenuAreasTI} to={'/ninoti/blockchain'} >
                    <li className={styles.menuBlockchainECriptoAtivos} id="6">
                        Blockchain
                        <LogoBlockchain largura={'30px'} altura={'30px'} />
                    </li>
                </Link>
                <Link className={styles.linkMenuAreasTI} to={'/ninoti/ia'} >
                    <li className={styles.menuInteligenciaArtificial} id="10">
                        Inteligência Artficial
                        <LogoIA largura={'30px'} altura={'30px'} />
                    </li>
                </Link>
                <Link className={styles.linkMenuAreasTI} to={'/ninoti/hardware'} >
                    <li className={styles.menuHardware} id="7">
                        Hardware
                        <LogoHardware largura={'35px'} altura={'35px'} />
                    </li>
                </Link>
                <Link className={styles.linkMenuAreasTI} to={'/ninoti/os'} >
                    <li className={styles.menuOS} id="5">
                        Sistema Operacional
                        <LogoOS largura={'35px'} altura={'35px'} className={styles.menuLogoOS} />
                    </li>
                </Link>
                <Link className={styles.linkMenuAreasTI} to={'/ninoti/redes'} >
                    <li className={styles.menuRedes} id="8">
                        Redes
                        {/* <LogoRede largura={'50px'} altura={'20px'} /> */}
                        <LogoCyberSecurity largura={'35px'} altura={'35px'} />
                    </li>
                </Link>
                <Link className={styles.linkMenuAreasTI} to={'/ninoti/data-science'} >
                    <li className={styles.menuDataScience} id="9">
                        Data Science
                        <LogoDataScience largura={'30px'} altura={'30px'} />
                    </li>
                </Link>
                <Link className={styles.linkMenuAreasTI} to={'/ninoti/design-ux'} >
                    <li className={styles.menuDesignEUX} id="4">
                        Design e UX
                        <LogoDesignUx largura={'30px'} altura={'30px'} />
                    </li>
                </Link>
            </ul>
        </aside>
    );
};
