import CardsMyAnimesCompletList from '../../components/componentsMyAnimes/CardsMyAnimesCompletList/CardsMyAnimesCompletList';
import H1TituloPage from '../../components/H1TituloPage/H1TituloPage';
import H2SubTitulo from '../../components/H2SubTitulo/H2SubTitulo';
import HeaderPage from '../../components/HeaderPage/HeaderPage';
import styles from './MyAnimesLista.module.css';
import { useContext } from 'react';
import AnimesObjsListDetalhesContext from '../../context_api/AnimesObjsListDetalhesContext/AnimesObjsListDetalhesContext';


export default function MyAnimesLista() {
  const { listObjsDetalhesAnimes } = useContext(AnimesObjsListDetalhesContext);
  return (
    <>
      <HeaderPage>
        <H1TituloPage>Animes</H1TituloPage>
        <H2SubTitulo>Lista completa de todos os <span className={styles.spanTotalAnimes}>{listObjsDetalhesAnimes.length}</span> Animes que tenho registrado.</H2SubTitulo>
        </HeaderPage>
      <CardsMyAnimesCompletList />
    </>
  );
};
