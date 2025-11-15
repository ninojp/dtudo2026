// src/hooks/usePaginatedFetch.js
import { useState, useEffect, useCallback } from 'react';
import axiosHttpRequest from '../api_conect/conectApiLocal';
import useDebounce from './useDebounce'; // Criaremos este hook a seguir

/**
 * Hook customizado para buscar dados paginados e com filtro de busca.
 * @param {string} endpoint - O endpoint da API para buscar os dados.
 * @param {number} limit - O número de itens por página.
 * @returns {object} - Estado e funções para gerenciar os dados.
 */
export function usePaginatedFetch(endpoint, limit = 10) {
    const [data, setData] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    // Estado da Paginação
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    // Estado da Busca
    const [searchTerm, setSearchTerm] = useState('');
    const debouncedSearchTerm = useDebounce(searchTerm, 500); // Atraso de 500ms

    const fetchData = useCallback(async () => {
        setIsLoading(true);
        setError(null);
        try {
            // Parâmetros para json-server (paginação e busca)
            const params = {
                _page: page,
                _limit: limit,
                q: debouncedSearchTerm || undefined, // 'q' é o parâmetro de busca full-text do json-server
            };
            console.log('Fetching data with params:', params);

            const response = await axiosHttpRequest.get(endpoint, { params });
            console.log('Response headers:', response.headers);

            // json-server retorna o total de itens no header 'x-total-count'
            const totalCount = response.headers['x-total-count'];
            console.log('Total count from header:', totalCount);

            setTotalPages(Math.ceil(totalCount / limit));
            setData(response.data);

        } catch (err) {
            console.error(`Erro ao buscar dados de ${endpoint}:`, err);
            setError(err);
        } finally {
            setIsLoading(false);
        }
    }, [page, debouncedSearchTerm, endpoint, limit]);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    // Reseta a página para 1 sempre que um novo termo de busca é aplicado
    useEffect(() => {
        setPage(1);
    }, [debouncedSearchTerm]);

    return {
        data,
        isLoading,
        error,
        page,
        setPage,
        totalPages,
        searchTerm,
        setSearchTerm,
    };
}
