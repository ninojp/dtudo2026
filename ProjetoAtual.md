# temp

Este meu projeto atual está funcionando, primeiro preciso que você leia o arquivo: package.json, na raiz do projeto, para entender meu projeto.
Minha base de dados LOCAL está em: api/db/animacoes.json, sendo disponibilizada via json-server: http://localhost:3666/animacoes. Este end-point fornece minha coleção local de ANIMAÇÕES, dentro de cada "animacoes" ficam meus animes ("subpastas").
Neste meu arquivo: src/pages/MyAnimesDetalhes.jsx estou usando um componente que acessa uma API EXTERNA: https://api.jikan.moe/v4/anime/${id_mal}/full, que está me retornado os detalhes de cada anime, esta api possui as limitações de no máximo 60 requisições por minuto ou 3 por segundo.
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
            },
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

Animes duplicados encontrados (não adicionados): [
2105
]
