// src/hooks/useDebounce.js
import { useState, useEffect } from 'react';

/**
 * Hook que atrasa a atualização de um valor (debounce).
 * @param {*} value - O valor a ser "debatido".
 * @param {number} delay - O tempo de atraso em milissegundos.
 * @returns {*} - O valor após o atraso.
 */
export default function useDebounce(value, delay) {
    const [debouncedValue, setDebouncedValue] = useState(value);

    useEffect(() => {
        // Configura um timer para atualizar o valor "debatido" após o delay
        const handler = setTimeout(() => {
            setDebouncedValue(value);
        }, delay);

        // Limpa o timer se o valor mudar (ex: usuário continua digitando)
        return () => {
            clearTimeout(handler);
        };
    }, [value, delay]);

    return debouncedValue;
}
