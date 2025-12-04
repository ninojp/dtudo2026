import { Link } from 'react-router-dom';
import LogoFronEnd from '../areasTI/LogoFronEnd';
import styles from './AsideNinoTIPage.module.css';
import LogoProgramacao from '../areasTI/LogoProgramacao';
import LogoCyberSecurity from '../areasTI/LogoCyberSecurity';
import LogoBlockchain from '../areasTI/LogoBlockchain';
import LogoIA from '../areasTI/LogoIA';
import LogoHardware from '../areasTI/logoHardware';
import LogoOS from '../areasTI/LogoOS';
import LogoDataScience from '../areasTI/LogoDataScience';
import LogoDesignUx from '../areasTI/LogoDesignUx';
import LogoDevops from '../areasTI/LogoDevops';
// import LogoRede from '../areasTI/LogoRede';
export default function AsideNinoTIPage() {
    return (
        <aside className={styles.asideMenuAreasTI}>
            <p className="tituloDescricao">Estudando TI há 28 anos<br /> Trabalhando e vivendo dela há 17</p>
            <ul className={styles.ulMenuAreasTI}>
                <Link className={styles.linkMenuAreasTI} to={'/ninoti/front-end'} >
                    <li className='styleFrontEnd' id="2">
                        Front-End
                        <LogoFronEnd largura={'30px'} altura={'30px'} />
                    </li>
                </Link>
                <Link className={styles.linkMenuAreasTI} to={'/ninoti/programacao'} >
                    <li className='styleBackEnd' id="1">
                        Programação
                        <LogoProgramacao largura={'30px'} altura={'30px'} />
                    </li>
                </Link>
                <Link className={styles.linkMenuAreasTI} to={'/ninoti/cyber-security'} >
                    <li className='styleCyberSecurity' id="3">
                        Cyber Security
                        <LogoDevops largura={'30px'} altura={'30px'} />
                    </li>
                </Link>
                <Link className={styles.linkMenuAreasTI} to={'/ninoti/blockchain'} >
                    <li className='styleBlockchain' id="6">
                        Blockchain
                        <LogoBlockchain largura={'30px'} altura={'30px'} />
                    </li>
                </Link>
                <Link className={styles.linkMenuAreasTI} to={'/ninoti/ia'} >
                    <li className='styleIA' id="10">
                        Inteligência Artficial
                        <LogoIA largura={'30px'} altura={'30px'} />
                    </li>
                </Link>
                <Link className={styles.linkMenuAreasTI} to={'/ninoti/hardware'} >
                    <li className='styleHardware' id="7">
                        Hardware
                        <LogoHardware largura={'35px'} altura={'35px'} />
                    </li>
                </Link>
                <Link className={styles.linkMenuAreasTI} to={'/ninoti/os'} >
                    <li className='styleOS' id="5">
                        Sistema Operacional
                        <LogoOS largura={'35px'} altura={'35px'} className={styles.menuLogoOS} />
                    </li>
                </Link>
                <Link className={styles.linkMenuAreasTI} to={'/ninoti/redes'} >
                    <li className='styleRedes' id="8">
                        Redes
                        {/* <LogoRede largura={'50px'} altura={'20px'} /> */}
                        <LogoCyberSecurity largura={'35px'} altura={'35px'} />
                    </li>
                </Link>
                <Link className={styles.linkMenuAreasTI} to={'/ninoti/data-science'} >
                    <li className='styleDataScience' id="9">
                        Data Science
                        <LogoDataScience largura={'30px'} altura={'30px'} />
                    </li>
                </Link>
                <Link className={styles.linkMenuAreasTI} to={'/ninoti/design-ux'} >
                    <li className='styleDesignEUX' id="4">
                        Design e UX
                        <LogoDesignUx largura={'30px'} altura={'30px'} />
                    </li>
                </Link>
            </ul>
        </aside>
    );
};
