import CardsMyAnimesList from '../../components/componentsMyAnimes/CardsMyAnimesList/CardsMyAnimesList';
import H1TituloPage from '../../components/H1TituloPage/H1TituloPage';
import H2SubTitulo from '../../components/H2SubTitulo/H2SubTitulo';
import HeaderPage from '../../components/HeaderPage/HeaderPage';
import ParagrafoPage from '../../components/ParagrafoPage/ParagrafoPage';

export default function MyAnimes() {
  return (
    <>
      <HeaderPage>
        <H1TituloPage>MyAnimes</H1TituloPage>
        <H2SubTitulo>Lista de todas Animações que eu já assisti</H2SubTitulo>
        </HeaderPage>
      <CardsMyAnimesList />
    </>
  );

};
