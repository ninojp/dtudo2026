import { BrowserRouter, Route, Routes } from "react-router-dom";
import Animex from "../pages/Animex/Animex";
import AnimexDetalhes from "../pages/AnimexDetalhes/animex-detalhes";
import { AnimexLayout } from "../layouts/AnimexLayout/AnimexLayout";
import { Register } from "../pages/Register/Register";
import { Login } from "../pages/Login/Login";
import AnimexDetalhesProvider from "../contextAPI/AnimexDetalhesProvider/AnimexDetalhesProvider";
import Logout from "../pages/Logout/Logout";
import ProtetorDeRota from "../components/ProtetorDeRota/ProtetorDeRota";
import NotFound from "../pages/NotFound/NotFound";

export default function AnimexRouter() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path='/auth' element={<AnimexLayout />}>
                    <Route path='register' element={<Register />} />
                    <Route path='login' element={<Login />} />
                    <Route path='logout' element={<Logout />} />
                </Route>
                <Route path='/' element={<AnimexLayout />}>
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
                    <Route path='*' element={<NotFound />} />
                </Route>
            </Routes>
        </BrowserRouter>
    );
};
