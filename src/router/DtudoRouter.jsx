import { BrowserRouter, Route, Routes } from "react-router-dom";
import Animex from "../pages/Animex/Animex";
import MyAnimes from "../pages/MyAnimes/MyAnimes";
import AnimexDetalhes from "../pages/AnimexDetalhes/animex-detalhes";
import { Register } from "../pages/Register/Register";
import { Login } from "../pages/Login/Login";
import AnimexDetalhesProvider from "../context_api/AnimexDetalhesContext/AnimexDetalhesProvider";
import Logout from "../pages/Logout/Logout";
import ProtetorDeRota from "../components/ProtetorDeRota/ProtetorDeRota";
import NotFound from "../pages/NotFound/NotFound";
import App from "../App";
import { AnimexLayout } from "../layouts/AnimexLayout/AnimexLayout";
import { IndexLayout } from "../layouts/IndexLayout/IndexLayout";

export default function DtudoRouter() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<IndexLayout />} >
                    {/* <Route path="" element={<App />} /> */}
                    <Route path="" element={<MyAnimes />} />
                    <Route path='/auth' element={<AnimexLayout />} >
                        <Route path='register' element={<Register />} />
                        <Route path='login' element={<Login />} />
                        <Route path='logout' element={<Logout />} />
                    </Route>
                    <Route path="/myanimes" element={<MyAnimes />} />
                    <Route path='/animex' element={<AnimexLayout />} >
                        <Route path="" element={<ProtetorDeRota>
                            <Animex />
                        </ProtetorDeRota>
                        } />
                        <Route path="animex-detalhes/:slug" element={<ProtetorDeRota>
                            <AnimexDetalhesProvider>
                                <AnimexDetalhes />
                            </AnimexDetalhesProvider>
                        </ProtetorDeRota>
                        } />
                    </Route>
                    <Route path='*' element={<NotFound />} />
                </Route>
            </Routes>
        </BrowserRouter>
    );
};
