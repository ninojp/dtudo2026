import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import AnimexObjsListProvider from './context_api/AnimexObjsListContext/AnimexObjsListProvider';
import ScrollToTop from './components/ScrollToTop/ScrollToTop.jsx';
import DtudoRouter from './router/DtudoRouter.jsx';
import { AuthProvider } from './context_api/AuthContext/AuthProvider.jsx';
import { AnimesObjsListProvider } from './context_api/AnimesObjsListContext/AnimesObjsListContext.jsx';

createRoot(document.getElementById('root')).render(
    <StrictMode>
        <AnimexObjsListProvider>
            <AnimesObjsListProvider>
                <AuthProvider>
                    <DtudoRouter >
                        <App />
                        <ScrollToTop />
                    </DtudoRouter>
                </AuthProvider>
            </AnimesObjsListProvider>
        </AnimexObjsListProvider>
    </StrictMode>
);
