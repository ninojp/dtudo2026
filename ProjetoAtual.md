# temp

Este meu projeto atual está funcionando, primeiro preciso que você leia o arquivo: package.json, na raiz do projeto, para entender meu projeto.
Minha base de dados LOCAL está em: api/db/animacoes.json, sendo disponibilizada via json-server: http://localhost:3666/animacoes. Este end-point fornece minha coleção local de ANIMAÇÕES, dentro de cada "animacoes" ficam meus animes ("subpastas").
Neste meu arquivo: src/pages/MyAnimesDetalhes.jsx estou usando um componente que acessa uma API EXTERNA: https://api.jikan.moe/v4/anime/${id_mal}/full, que está me retornado os detalhes de cada anime, esta api possui as limitações de no máximo 60 requisições por minuto ou 3 por segundo.
Eu preciso SALVAR os detalhes de cada anime na minha base de dados local, dentro dos seus repectivos locais ("subpastas"). Como posso fazer isso de forma automatizada pois são quase 3000 mil animes. Me pergunte se vc precisar de mais detalhes.

===========================================================================
FAZER A TROCA DOS NOMES DAS IMAGENS ANTES
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
