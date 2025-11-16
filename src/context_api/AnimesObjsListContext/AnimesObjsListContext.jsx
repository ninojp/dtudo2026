import { createContext, useState, useEffect } from 'react';
import axios from 'axios';

const AnimesObjsListContext = createContext();

export const AnimesObjsListProvider = ({ children }) => {
    const [listObjsAnimes, setListObjsAnimes] = useState([]);

    useEffect(() => {
        axios.get('/api_backend/db/animacoes.json')
            .then(response => {
                setListObjsAnimes(response.data.animacoes || []);
            })
            .catch(error => console.error('Erro ao buscar a lista de animes:', error));
    }, []);

    return (
        <AnimesObjsListContext.Provider value={{ listObjsAnimes }}>
            {children}
        </AnimesObjsListContext.Provider>
    );
};

export default AnimesObjsListContext;
