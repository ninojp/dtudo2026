import CardsAnimexList from '../../components/componentsAnimex/CardsAnimexList/CardsAnimexList';
import H1TituloPage from '../../components/H1TituloPage/H1TituloPage';
import H2SubTitulo from '../../components/H2SubTitulo/H2SubTitulo';
import HeaderPage from '../../components/HeaderPage/HeaderPage';

export default function Animex() {
    return (
        <>
            <HeaderPage>
                <H1TituloPage>AnimeX</H1TituloPage>
                <H2SubTitulo>Minha coleção de Hentai!S</H2SubTitulo>
            </HeaderPage>
            <CardsAnimexList />
        </>
    );
};
