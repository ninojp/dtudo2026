# temp

Este meu projeto atual está funcionando, primeiro preciso que você leia o arquivo: package.json, na raiz do projeto, para entender meu projeto.
Minha base de dados LOCAL está em: api/db/animacoes.json, sendo disponibilizada via json-server: <http://localhost:3666/animacoes>. Este end-point fornece minha coleção local de ANIMAÇÕES, dentro de cada "animacoes" ficam meus animes ("subpastas").
Neste meu arquivo: src/pages/MyAnimesDetalhes.jsx estou usando um componente que acessa uma API EXTERNA: <https://api.jikan.moe/v4/anime/${id_mal}/full>, que está me retornado os detalhes de cada anime, esta api possui as limitações de no máximo 60 requisições por minuto ou 3 por segundo.
Eu preciso SALVAR os detalhes de cada anime na minha base de dados local, dentro dos seus repectivos locais ("subpastas"). Como posso fazer isso de forma automatizada pois são quase 3000 mil animes. Me pergunte se vc precisar de mais detalhes.

===========================================================================

Este meu arquivo: PastasMyAnimes está funcionando, mas agora eu preciso que meu arquivo de saida: api/db/myanimes.json, tenha sua estrutura interna diferente da atual. Abaixo vou colocar um exemplo (com comentários) de como eu gostária que meu arquivo json ficasse.
{
  "animacoes": [
    {
      "nome": ".Hack",
      "slug": ".hack",
      "imgSrc": ".hack.jpg",
      "subpastas": [
        {
          "id": 299, //RENOMEAR PARA "mal_id"
          "nome": "2002 .hack Liminality - OVA",
          "ano": "2002",
          "nomeSemAno": ".hack Liminality - OVA",
          "jaAssisti": false, //ADICIONAR ESTE ATRIBUTO "jaAssisti": false
          "gostei": false, //ADICIONAR ESTE ATRIBUTO "gostei": false
          "arquivos": [
            {
              "nome": "299.jpg",
              "tipo": "arquivo"//REMOVER ESTE ATRIBUTO, não preciso mais de "tipo":
            },
            {
              ...
            }
===========================================================================================

Este meu arquivo: PastasMyAnimes, na linha 23 tem uma função que varre recursivamente até 2 níveis de subpasta dos diretórios de origem, encontra imagens com nomes numéricos (ex: 123.jpg) e as copia para a pasta de destino.
Agora quero fazer a mesma coisa, mas usando apenas a primeira subpasta do nivel 2, copiando apenas a primeira imagem numérica (ex: 123.jpg) que encontrar, e renomeando esta imagem para o nome que é gerado na linha 129 ( imgSrc: `${normalizeName(item.name)}.jpg`,) e copiando esta imagem para a pasta do projeto: public/myanimes/
===========================================================================================

Agora preciso identificar na pasta: public/myanimes/ quais imagens estão sendo usadas no arquivo: api/db/myanimes.json e quais não estão sendo usadas.
Preciso de um script que gere um relatório listando as imagens que estão sendo usadas e as que não estão sendo usadas.

verifique novamente, pois na pasta: public/myanimes temos exatamente 1026 arquivos e pela quantidade de "id": 1005 no Temos arquivo: api/db/myanimes.json, deveriam ser 1005 arquivos.

===========================================================================================
este meu arquivo: populateAnimeDetails.js está funcionado, mas preciso de mais algumas melhorias:

- Agora eu quero que ele salve os detalhes de cada anime em uma lista separada, dentro da pasta: api/db/animeDetails.json
- verificar se o arquivo de destino já existe antes de salvar se tem animes duplicados e fazer um log listando estes duplicados e salvar os animes em ordem crescente por mal_id.

===========================================================================================

Nesta minha pagina atual: src/pages/MyMusicX.jsx estou consumindo uma API EXTERNA: https://api.discogs.com/artists/Baia&Rockboys, que ao pesquisar por um artista está me retornado os detalhes de cada artista, álbuns, singles, compilações, etc.
Eu preciso criar um botão para SALVAR os detalhes de cada artista na minha base de dados local, dentro do arquivo: api/db/cdsDB.json, com a seguinte estrutura:
cdsDB.json
{
    cdsBD: [
        {
            "artist": "Baia & Rockboys",
            "Albums": [
                    {
                        id: 27529317,
                        "title": "Rockboys",
                        "year": 2001,
                        "thumb": "https://i.discogs.com/MzE3LTE2ODgwNTY3/NTYtMTIzNi5qcGVn.jpeg",
                        "uri": "https://api.discogs.com/releases/27529317"
                    }
                ],
            "Compilations": [],
            "Releases": [],
            "Singles & EPs": []
        }
    ],
}
===========================================================================================

Agora preciso de um novo script, dentro da pasta: api/DiscografiaPastas.js, que leia o arquivo: api/db/cdsDB.json e apartir dele crie uma estrutura de pastas dentro do meu disco: E:\\DiscografiasPastas. Essa estrutura de pastas deve ter o seguinte formato:
E:\DiscografiasPastas
    \Baia & Rockboys\
        \1996 - Titulo - Album\
            \19844465.jpg  (baixar a imagem do thumb, e usar o id do cd como nome do arquivo)
        \2001 - Rockboys - Single\
            \19844466.jpg  (baixar a imagem do thumb)
        \2005 - Titulo - Compilation\
            \19844467.jpg  (baixar a imagem do thumb)


==========================================================================
Agora está funcionando, mas os reslutados da pesquisa não correspondem a os que eu gostaria, pois no site discogs.com o resultado para Biquini cavadão, por exemplo, traz:
66 - Releases
    20 - Albums
    32 - Singles & EPs
    12 - Compilations
    2 - Videos
Mas na minha aplicação está trazendo: results = 100, e na verdade eu gostaria que trouxesse apenas os 18 resultados que estão categorizados como Releases, e dentro destes releases os 9 albums, 5 singles e 4 compilações.

Não resolveu, continua a retornar os 100 resultados.
No site official do discogs: https://www.discogs.com/pt_BR/artist/131139-Racionais-MCs
Primeiramente quando busco no site por racionais, aparece uma lista suspensa, com alguns resultados, exemplo: Racionais MC's, somente quando eu escolho o artista correto, que no caso é Racionais MC's, é que eu consigo ver, artista/Discografia/releases/albuns-singles-compilatios.

O problema de resultados excessivos continua. O problema deve estar na url de consulta a API: https://api.discogs.com/database/search.
IA voce consegue acessar a documentação da API: https://www.discogs.com/developers
e ajustar a url de consulta para que retorne apenas os resultados corretos, conforme o site oficial do discogs.com?

Agora ficou ainda pior, os resultados estão vindo misturados com outros artistas. Vamos fazer como eu quero: quando digitarmos o nome do artista, o sistema deve fazer uma busca na API do discogs, trazer uma lista suspensa com os resultados (com id e nome do artista) para que eu possa escolher o artista correto. Somente após eu escolher o artista correto, é que o sistema deve buscar Somente a DISCOGRAFIA, (álbuns, singles e compilações).

https://www.discogs.com/pt_BR/artist/131139-Racionais-MCs?superFilter=Releases

Após analisar os objetos retornados pela API do discogs, percebi que para filtrar os resultados da discografia do artista "Racionais MCs", eu preciso usar as seguintes condições:
type: 'master', (todos que estiverem com o tipo 'master', devem ser colocados no resultado final)
type: 'release', (até pode ser 'release', desde que o cumpra todas as outras condições)
role: 'Main', (tem que ser 'Main')
artist: 'Racionais MCs' (TEM que ser o mesmo nome do artista)
artist: 'Racionais*' (pode ser com asterisco no final do nome do artista)
thumb: '', (não pode ser vazio)
year: '', (não pode ser vazio)

Perguntar a IA
Neste meu arquivo atual discogsProxy.js, a partir da linha 66, tem alguns filtros que filtram os resultados retornados pela API do discogs, mas mesmo assim os resultados continuam vindo errados.
Agora quero retirar todos os filtros do backend e colocar estes filtros no frontend: src/pages/MyMusicX/MyMusicX.jsx, na página, para que o usuário possa ver todos os resultados retornados pela API do discogs e FILTRAR e escolher quais ele quer exibir, para depois se necessário salvar na base de dados local.

Perguntar a IA
Neste meu arquivo atual MyMusicX.jsx, a partir da linha 41, tem um filtro automatico que eu gostaria que fosse aplicado no backend, dentro do arquivo: discogsProxy.js

Perguntar a IA
Neste meu arquivo atual discogsProxy.js está trazendo o resultado esperado 66, mas tudo junto e na verdade eu gostaria que trouxesse assim por exemplo:
66 Releases
    20 - Albums
    32 - Singles & EPs
    12 - Compilations
    2 - Videos
Para isso preciso que você me ajude a ajustar o código do backend: discogsProxy.js, para que ele retorne os resultados desta forma categorizada e aplique as mudanças necessárias no frontend: MyMusicX.jsx para exibir estes resultados corretamente.

Este meu script atual: discogsProxy.js não esta fazendo o que deveria, buscar os dados na API: https://api.discogs.com/artists/${artistId}/releases. E agrupar o resultado em Album, Single e EP, Comp (Compilações) e Video. Preciso que você me ajude a corrigir este script para que ele faça o que eu preciso.
No console do navegador está retornando o seguinte: {artist: 'Biquini Cavadão', items: Array(66), summary: {…}}

O codigo ainda não está funcionando corretamente, mas agora eu entendi o que você tem que fazer. Pesquisando no site official da API do discogs: https://www.discogs.com/. Ao pesquisar por exemplo, pelo artista: biquine cavadão, a API retorna uma lista de 66 releases, 20 albums, 32 singles EP, 12 compilações e 2 Videos. Sendo que cada release pode ter varias versões, do mesmo (main_release). Percebi que o objeto de retorno tem o atributo format, que quando está vazio, significa que tem um main_release, e este deve conter o format correto (Album, Single, EP, Comp, Video).
Portanto, agora por favor ajuste o código do backend: discogsProxy.js, para que ele retorne os resultados desta forma categorizada e aplique as mudanças necessárias no frontend: MyMusicX.jsx para exibir estes resultados corretamente.

Legal funcionou, mas ainda não ficou igual ao resultado do site oficial do discogs.com: 66 releases, 20 albums, 32 singles EP, 12 compilações e 2 Videos. Meu resultado foi: summary: Total: 66
categories: 
albums: {count: 34, items: Array(34)}
compilations: {count: 4, items: Array(4)}
singlesEPs: {count: 26, items: Array(26)}
videos: {count: 2, items: Array(2)}
{count: 26, items: Array(26)}
preciso que você ajuste o código do backend: discogsProxy.js, para que ele retorne os resultados exatamente igual ao resultado do site oficial do discogs.com.

Agora melhorou bastante, temos: 20 albums (que está correto, e é o principal), 40 singles e EP (está um pouco acima do esperado), 2 videos (está correto). O problema maior está nas compilações, 38 compilações, quando no site oficial do discogs.com são apenas 12 compilações. Preciso que você ajuste o código Novamente!

Agora o resultado total de releases está errado: 75 releases, deveria ser 66. Em albuns, permanece 100% correto, em Singles e EPs, permanece 40 (deveria ser 32) e percebi que os 8 singles e EPs a mais, são na verdade compilações (exemplo: Millennium - 20 Músicas Do Século XX - 1999, é uma compilação) que estão indo para o lugar errado. Em Compilações, agora temos 13, mas são resultados em sua maioria errados, não são as compilações corretas (retornados no site). Preciso que você ajuste o código Novamente!

Pergunatr a IA
Neste meu arquivo atual discogsProxy.js deveria trazer o resultado esperado de 66 releases (pesquisa de exemplo, biquine cavadão), 20 albums, 32 singles & EP, 12 compilações e 2 Videos (como no resultado do site oficial da API do discogs.com), mas não está trazendo. Preciso que você me ajude a corrigir este script para que ele faça o que eu preciso. No console do navegador está retornando o seguinte: Resposta busca releases:Resposta busca releases: 
{artist: 'Biquini Cavadão', items: Array(43), summary: {…}}
artist: "Biquini Cavadão"
items: (43) [{…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}]
summary: Total: 43
categories: albums: {count: 7, items: Array(7)}compilations: {count: 0, items: Array(0)}singlesEPs: {count: 36, items: Array(36)}videos: {count: 0, items: Array(0)}

Agora o total de releases está correto: 66 releases, mas distribuição dos resultados continuam erradas: [DISCOGS] Artist: Biquini Cavadão | Total: 66 | Albums: 7 | Singles/EPs: 48 | Compilations: 9 | Videos: 2.
Vou apontar especificamente os erros. Deveriam ser albuns mas estão em Singles e EPs:
3: {id: 799503, title: 'Cidades Em Torrente', type: 'master', main_release: 2240950, artist: 'Biquini Cavadão', …}
5: {id: 813911, title: 'A Era Da Incerteza', type: 'master', main_release: 2240961, artist: 'Biquini Cavadão', …}
8: {id: 799506, title: 'Zé', type: 'master', main_release: 1743109, artist: 'Biquini Cavadão', …}
10: {id: 799505, title: 'Descivilização', type: 'master', main_release: 2887027, artist: 'Biquini Cavadão', …}
entre outros...
deveriam ser compilações mas estão em Singles e EPs:
23: {id: 1441164, title: 'Novo Millennium - 20 Músicas Para Uma Nova Era', type: 'master', main_release: 9167139, artist: 'Biquini Cavadão', …}
Seleção Essencial 2013

Lembrando que o resultado esperado é: 66 releases, 20 albums, 32 singles & EP, 12 compilações e 2 Videos.


