# temp

Este meu projeto atual está funcionando, primeiro preciso que vc leia o package.json para conhecer meu projeto.
Minha base de dados LOCAL está em: api/db/animacoes.json, sendo disponibilizada via json-server: http://localhost:3666/animacoes. Este end-point fornece minha coleção local de ANIMAÇÕES, dentro de cada "animacoes" ficam meus animes ("subpastas").
Neste meu arquivo: src/pages/MyAnimesDetalhes.jsx estou usando um componente que acessa uma API EXTERNA: https://api.jikan.moe/v4/anime/${id_mal}/full, que está me retornado os detalhes de cada anime, esta api possui as limitações de no máximo 60 requisições por minuto ou 3 por segundo.
Eu preciso SALVAR os detalhes de cada anime na minha base de dados local, dentro dos seus repectivos locais ("subpastas"). Como posso fazer isso de forma automatizada pois são quase 3000 mil animes. Me pergunte se vc precisar de mais detalhes.
