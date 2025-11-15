import styles from './CardMyAnimes.module.css';
import { useEffect, useState } from 'react';
import axiosHttpRequest from '../../api_conect/conectApiLocal';
import CampoBuscarMyAnimes from '../CampoBuscarMyAnimes/CampoBuscarMyAnimes';

export default function CardMyAnimes() {
    const [animacoes, setAnimacoes] = useState([]);
    useEffect(() => {
        axiosHttpRequest.get('/objAnimacoes')
            .then((response) => {
                console.log(response);
                // json-server com chave "animacoes" retorna a lista em response.data
                // se o endpoint devolver um objeto { animacoes: [...] } adaptamos abaixo
                const data = response.data?.animacoes ?? response.data ?? [];
                setAnimacoes(data);
            })
            .catch((error) => {
                console.error('Erro ao buscar animações:', error);
            });
    }, []);
    //=============================================================================================
    // Lógica para buscar conforme o valor muda
    const consultarAnimacaoPorNome = async (termoBuscado) => {
        try {
            const todasAnimacao = await axiosHttpRequest.get('/objAnimacoes');
            // Se não houver termo de busca, retorna todas as animações
            if (!termoBuscado) {
                return todasAnimacao.data;
            }
            // Filtra as animações pelo termo de busca
            const animacaoFiltradas = todasAnimacao.data.filter((animacao) => {
                return animacao.nome.toLowerCase().includes(termoBuscado.toLowerCase());
            });
            return animacaoFiltradas;
        } catch (error) {
            console.error('Erro! consultarAnimacaoPorNome()', error);
            throw error;
        }
    }
    //=============================================================================================
    return (
        <>
            <CampoBuscarMyAnimes onSearch={async (valor) => {
                const resultados = await consultarAnimacaoPorNome(valor);
                setAnimacoes(resultados);
            }} />
            <p>Esta é uma seção para listar por ordem alfabetica todos as minhas animações.</p>
            <div className={styles.containerListaCardAnimacaoDiv}>
                {animacoes.map((animacao) => (
                    <article key={String(animacao.id)} className={styles.animacaoCardArticle}>
                        <h3>{animacao.nome}</h3>
                        <figure className={styles.figureImagemAnimacao}>
                            <img
                                className={styles.imgAnimacao}
                                src={animacao.imgSrc ? `/myanimes/${encodeURIComponent(String(animacao.imgSrc))}` : '/icone-editar.png'}
                                alt={animacao.nome}
                            />
                        </figure>
                        <p>{animacao.id}</p>
                    </article>
                ))}
            </div>
        </>
    );
};
