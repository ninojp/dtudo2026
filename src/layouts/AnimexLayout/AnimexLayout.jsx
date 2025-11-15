import { Outlet } from "react-router";
import HeaderPage from "../../components/HeaderPage/HeaderPage";
import styles from './AnimexLayout.module.css';

export const AnimexLayout = () => {
    return (
        <>
            <HeaderPage>
                <div className={styles.divContainerTituloAnimex}>
                    <h1 className={styles.h1TituloAnimex}>AnimeX - Minha coleção de Hentai!S</h1>
                </div>
            </HeaderPage>
            <Outlet />
        </>
    );
};
