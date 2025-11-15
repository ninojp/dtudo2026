import { useState, useEffect, useCallback } from "react";
import styles from "./CampoBuscarMyAnimes.module.css";

export default function CampoBuscarMyAnimes({ onSearch }) {
    const [valor, setValor] = useState("");
    const [isFocused, setIsFocused] = useState(false);
    //------------------------------------------------
    const handleSearch = useCallback(() => {
        const trimmedValue = valor.trim();
        if (trimmedValue && trimmedValue.length >= 3) {
            onSearch(trimmedValue);
        } else if (!trimmedValue) {
            onSearch(''); // Limpa a busca quando vazio
        }
    }, [onSearch, valor]);
    //--------------------------------------------------
    const handleKeyPress = (e) => {
        if (e.key === 'Enter') {
            handleSearch();
        }
    };
    //---------------------------------------------------------------------
    const handleInputChange = (e) => {
        const newValue = e.target.value;
        setValor(newValue);        
        // Se o campo ficar vazio, limpa a busca
        if (!newValue.trim()) {
            onSearch('');
        }
    };
    //------------------------
    const handleBlur = () => {
        setIsFocused(false);
        handleSearch(); // Executa busca ao perder foco
    };
    //-------------------------
    const handleFocus = () => {
        setIsFocused(true);
    };
    //----------------------------------------------
    useEffect(() => {
        if (isFocused && valor.trim().length >= 3) {
            const timeoutId = setTimeout(() => {
                handleSearch();
            }, 300);
            return () => clearTimeout(timeoutId);
        }
    }, [valor, handleSearch, isFocused]);
    //----------------------------------------------
    return (
        <fieldset className={styles.fieldsetCampoBuscar}>
            <label htmlFor="campo-buscar" className="labelInput">Digite o nome do Anime que procura</label>
            <input
                id="campo-buscar"
                className={styles.inputCampoBuscar}
                type="search"
                placeholder="Digite o que procura"
                value={valor}
                onChange={handleInputChange}
                onKeyPress={handleKeyPress}
                onBlur={handleBlur}
                onFocus={handleFocus}
                name="campoBuscar"
            />
        </fieldset>
    );
};
