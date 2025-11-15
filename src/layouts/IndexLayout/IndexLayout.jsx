import { Outlet } from 'react-router'
import NavBarPage from '../../components/NavBarPage/NavBarPage';
import FooterPage from '../../components/FooterPage/FooterPage';

export const IndexLayout = () => {
    return (
        <>
            <NavBarPage />
            <Outlet />
            <FooterPage />
        </>
    );
};
