import { use, useEffect } from "react";
import AuthContext from "../../contextAPI/AuthProvider/AuthContext";
import { Spinner } from "../Spinner";
import { useNavigate } from "react-router-dom";

export default function ProtetorDeRota({ children }) {
    const { isAuthenticated, isLoading } = use(AuthContext);
    const navegarPara = useNavigate();
    //------------------------------------------------------
    useEffect(() => {
        if(!isLoading && !isAuthenticated){
            navegarPara('/auth/login');
        }
    }, [isAuthenticated, isLoading, navegarPara]);
    //------------------------------------------------------
    if (isLoading) {
        return <Spinner />;
    };
    if (!isAuthenticated) {
        return null;
    };
    //==============
    return children
};
