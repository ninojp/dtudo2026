"use client";
import React, { useEffect, useState } from "react";
import styles from './FooterPage.module.css';

//-----------------------------------------
const dataAtualFormatada = () => {
    const now = new Date();
    return {
        date: now.toLocaleDateString("pt-BR"),
        weekday: now.toLocaleDateString("pt-BR", { weekday: "long" }),
        time: now.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" }),
    };
};
//=================================================================
export default function FooterPage({ children }) {
    const [dataAtual, setDataAtual] = useState(dataAtualFormatada());
    useEffect(() => {
        const timer = setInterval(() => setDataAtual(dataAtualFormatada()), 60_000); // atualiza a cada minuto
        return () => clearInterval(timer);// limpa o timer ao desmontar o componente
    }, []);

    return (
        <footer className={styles.footerContainer}>
            <div>
                <p>Criado em 28/10/2025 - by NinoJP</p>
            </div>
            <div>
                {`${dataAtual.date} - ${dataAtual.weekday} às ${dataAtual.time}`}
                {children && <div>{children}</div>}
            </div>
        </footer>
    );
};
