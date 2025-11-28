import { Outlet } from 'react-router'
import NavBarPage from '../../components/NavBarPage/NavBarPage';
import FooterPage from '../../components/FooterPage/FooterPage';
import HeaderPage from '../../components/HeaderPage/HeaderPage';

export default function IndexLayout() {
    return (
        <>
            <HeaderPage>
                <NavBarPage />
            </HeaderPage>
            <Outlet />
            <FooterPage />
        </>
    );
};
