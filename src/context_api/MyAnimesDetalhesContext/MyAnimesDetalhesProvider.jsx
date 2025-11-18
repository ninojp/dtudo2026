import { use, useState, useMemo } from "react";
import { useParams } from "react-router-dom";
import MyAnimesObjsListContext from "../MyAnimesObjsListContext/MyAnimesObjsListContext";
import MyAnimesDetalhesContext from "./MyAnimesDetalhesContext";

export default function MyAnimesDetalhesProvider({ children }) {
    const { slug } = useParams();
    const { listObjsMyAnimes, isLoading: isListLoading } = use(MyAnimesObjsListContext);
    //------------------------------------------------------------------------------
    const myAnimesDetalhes = useMemo(() => {
        if (isListLoading || !listObjsMyAnimes) return null;
        return listObjsMyAnimes.find(item => item.slug === slug);
    }, [listObjsMyAnimes, slug, isListLoading]);
    //----------------------------------------
    const [currentDisplayIdState, setCurrentDisplayId] = useState(null);
    //------------------------------------------------------------------
    const currentDisplayId = useMemo(() => {
        if (currentDisplayIdState) return currentDisplayIdState;
        return myAnimesDetalhes?.subpastas?.[0]?.id ?? null;
    }, [myAnimesDetalhes, currentDisplayIdState]);
    //==========================================
    return (
        <MyAnimesDetalhesContext.Provider
            value={{
                isLoading: isListLoading,
                myAnimesDetalhes,
                currentDisplayId,
                setCurrentDisplayId, // Agora você pode usar isso para definir um ID manualmente
            }}
        >
            {children}
        </MyAnimesDetalhesContext.Provider>
    );
};
