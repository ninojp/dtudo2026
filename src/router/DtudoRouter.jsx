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
import { IndexLayout } from "../layouts/IndexLayout/IndexLayout";
import MyAnimesDetalhes from "../pages/MyAnimesDetalhes/myanimes-detalhes";
import MyAnimesDetalhesProvider from "../context_api/MyAnimesDetalhesContext/MyAnimesDetalhesProvider";
import MyAnimesObjsListProvider from "../context_api/MyAnimesObjsListContext/MyAnimesObjsListProvider";

export default function DtudoRouter() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<IndexLayout />} >
                    <Route index element={<MyAnimes />} />
                    {/* Rotas para Endereços MyAnimes  */}
                    <Route path="/myanimes">
                        <Route index element={<MyAnimes />} />
                        <Route path="myanimes-detalhes/:slug" element={
                            <MyAnimesObjsListProvider>
                                <MyAnimesDetalhesProvider>
                                    <MyAnimesDetalhes />
                                </MyAnimesDetalhesProvider>
                            </MyAnimesObjsListProvider>} />
                    </Route>
                    {/* Rotas para Endereços Animex */}
                    <Route path='/animex'>
                        <Route index element={<ProtetorDeRota><Animex /></ProtetorDeRota>} />
                        <Route path="animex-detalhes/:slug" element={
                            <ProtetorDeRota>
                                <AnimexDetalhesProvider>
                                    <AnimexDetalhes />
                                </AnimexDetalhesProvider>
                            </ProtetorDeRota>}
                        />
                    </Route>
                    {/* Rotas para Endereços de Autentificação */}
                    <Route path='/auth'>
                        <Route path='register' element={<Register />} />
                        <Route path='login' element={<Login />} />
                        <Route path='logout' element={<Logout />} />
                    </Route>
                    {/* Rotas para Endereços NÃO reconhecidos! */}
                    <Route path='*' element={<NotFound />} />
                </Route>
            </Routes>
        </BrowserRouter >
    );
};
