
import { useContext, useState, useMemo } from 'react';
import AnimesObjsListDetalhesContext from '../../context_api/AnimesObjsListDetalhesContext/AnimesObjsListDetalhesContext';

export default function FiltrarPorGenero() {
    const { listObjsDetalhesAnimes, isLoading } = useContext(AnimesObjsListDetalhesContext);
    const [generoSelecionado, setGeneroSelecionado] = useState('');

    const generosUnicos = useMemo(() => {
        if (listObjsDetalhesAnimes.length > 0) {
            const allGenres = listObjsDetalhesAnimes.flatMap(anime => anime.genres || []);
            return [...new Set(allGenres.map(g => g.name))];
        }
        return [];
    }, [listObjsDetalhesAnimes]);

    const animesFiltrados = useMemo(() => {
        return generoSelecionado
            ? listObjsDetalhesAnimes.filter(anime =>
                anime.genres && anime.genres.some(g => g.name === generoSelecionado)
            )
            : listObjsDetalhesAnimes;
    }, [listObjsDetalhesAnimes, generoSelecionado]);

    if (isLoading) {
        return <div>Loading...</div>;
    }

    return (
        <div>
            <h2>Filtrar por Gênero</h2>
            <select
                value={generoSelecionado}
                onChange={(e) => setGeneroSelecionado(e.target.value)}
            >
                <option value="">Todos os gêneros</option>
                {generosUnicos.map(genero => (
                    <option key={genero} value={genero}>
                        {genero}
                    </option>
                ))}
            </select>
            <div>
                {animesFiltrados.map(anime => (
                    <div key={anime.mal_id || anime.id} style={{ border: '1px solid #ccc', margin: '10px', padding: '10px' }}>
                        <h3>{anime.title || anime.nome}</h3>
                        <p>Gêneros: {anime.genres ? anime.genres.map(g => g.name).join(', ') : 'N/A'}</p>
                        {/* Adicione mais detalhes conforme necessário */}
                    </div>
                ))}
            </div>
        </div>
    );
};
