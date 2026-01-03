import CardsMyAnimesCompletList from '../../components/componentsMyAnimes/CardsMyAnimesCompletList/CardsMyAnimesCompletList';
import H1TituloPage from '../../components/H1TituloPage/H1TituloPage';
import H2SubTitulo from '../../components/H2SubTitulo/H2SubTitulo';
import HeaderPage from '../../components/HeaderPage/HeaderPage';

export default function MyAnimesLista() {
  return (
    <>
      <HeaderPage>
        <H1TituloPage>Animes</H1TituloPage>
        <H2SubTitulo>É uma lista completa de todos Animes que tenho registrado.</H2SubTitulo>
        </HeaderPage>
      <CardsMyAnimesCompletList />
    </>
  );
};
