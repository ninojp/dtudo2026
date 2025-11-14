import { Outlet } from "react-router";
import HeaderPage from "../../components/HeaderPage/HeaderPage";
import FooterPage from "../../components/FooterPage/FooterPage";

export const AnimexLayout = () => {
    return (
        <>
            <HeaderPage />
            <Outlet />
            <FooterPage />
        </>
    );
};
