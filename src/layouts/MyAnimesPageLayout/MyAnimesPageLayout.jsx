import { Outlet } from "react-router";
import HeaderPage from "../../components/HeaderPage/HeaderPage";
// import styles from './AnimexLayout.module.css';

export const MyAnimesPageLayout = () => {
    return (
        <>
            <HeaderPage />
            <Outlet />
        </>
    );
};
