import { useEffect, useState } from "react";
import axiosHttpRequest from "../../api_conect/conectApiLocal";
import AnimesObjsListDetalhesContext from "./AnimesObjsListDetalhesContext";

export default function AnimesObjsListDetalhesProvider({ children }) {
    const [listObjsDetalhesAnimes, setListObjsDetalhesAnimes] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    async function fetchAllObjsDetalhesAnimes() {
        setIsLoading(true);
        try {
            const response = await axiosHttpRequest.get('/animesDetalhes');
            setListObjsDetalhesAnimes(response.data);
            console.log("Dados fetchAllObjsDetalhesAnimes: ", response.data);
            return response.data;
        } catch (error) {
            console.error("Erro ao buscar objetos AnimesDetalhes: ", error);
            throw error;
        } finally {
            setIsLoading(false);
        }
        }
    //Total de objetos, adicionar, atualizar, deletar...
    useEffect(() => {
        fetchAllObjsDetalhesAnimes();
    }, []);
    return (
        <AnimesObjsListDetalhesContext
            value={{ 
                listObjsDetalhesAnimes,
                isLoading,
            }}
        >
            {children}
        </AnimesObjsListDetalhesContext>
    );
};
