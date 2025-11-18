import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './main.css'
import AnimexObjsListProvider from './context_api/AnimexObjsListContext/AnimexObjsListProvider';
import ScrollToTop from './components/ScrollToTop/ScrollToTop.jsx';
import DtudoRouter from './router/DtudoRouter.jsx';
import { AuthProvider } from './context_api/AuthContext/AuthProvider.jsx';
import MyAnimesObjsListProvider from './context_api/MyAnimesObjsListContext/MyAnimesObjsListProvider.jsx';


createRoot(document.getElementById('root')).render(
    <StrictMode>
        <AnimexObjsListProvider>
            <MyAnimesObjsListProvider>
                <AuthProvider>
                    <DtudoRouter >
                        <ScrollToTop />
                    </DtudoRouter>
                </AuthProvider>
            </MyAnimesObjsListProvider>
        </AnimexObjsListProvider>
    </StrictMode>
);
