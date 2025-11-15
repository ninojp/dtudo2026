import { Link } from 'react-router-dom';
import styles from './HeaderPage.module.css';
import { IconAccount } from '../Icons/IconAccount';
import { IconLogout } from '../Icons/IconLogout';
import IconRegister from '../Icons/IconRegister';
import { use } from 'react';
import AuthContext from '../../context_api/AuthContext/AuthContext';
import { IconLogin } from '../Icons/IconLogin';

export default function HeaderPage() {
    const { isAuthenticated } = use(AuthContext);
    return (
        <header className={styles.headerPage}>
            <div className={styles.divContainerTituloAnimex}>
                <Link to="/">
                    <div className={styles.divContainerImgLogo}>
                        <img src="/Logo_Dtudo_300p.png" alt="Imagem Logo Dtudo" />
                    </div>
                </Link>
                <div className={styles.divTituloAnimex}>
                    <h1 className={styles.h1TituloAnimex}>AnimeX </h1>
                    <span className={styles.spanTituloAnimex}> Minha coleção de Hentai!S</span>
                </div>
            </div>
            <div className={styles.divContainerIconsLogin}>
                {!isAuthenticated && <Link to='/auth/register' title='Criar Conta'><IconRegister cor={'#ffffffc0'} largura={'24px'} altura={'24px'} /></Link>}
                {!isAuthenticated && <Link to='/auth/login' title='Fazer Login'><IconLogin cor={'#ffffffc0'} largura={'24px'} altura={'24px'} /></Link>}
                {isAuthenticated && <Link to='#' title='Perfil Usuário'><IconAccount cor={'#ffffffc0'} largura={'24px'} altura={'24px'} /></Link>}
                {isAuthenticated && <Link to='/auth/logout' title='Fazer Logout'><IconLogout cor={'#ffffffc0'} largura={'24px'} altura={'24px'} /></Link>}
            </div>
        </header>
    );
};
