const dbfunctions = require('./dbfunctions');
const {getnewheaders} = require("./assets/browserheaders");

// Objeto com nomes das databelas a serem criadas, é possível adicionar mais!
const optionsinstall = {
  criartabela: [
    "instagramusers",
    "tiktokusers",
    "youtubeusers",
    "twitchusers",
    "twitterusers"
  ]
};

// Executar instalação do banco de dados e tabelas
function instalar() {
  const instalar = new dbfunctions(optionsinstall);

  instalar.criarbancodedados().then(() => (instalar.criartabelas())).then(() => {
    
  }).then(() => {
    instalar.criartabelaheadershttp();
  }).then(() => {
    instalar.criartabelasproxy();
    console.log('Banco de dados e tabelas criados com sucesso!');
  }).then(() => {
    console.log('Gerando novos Headers!');
    getnewheaders(10, true);
  });
}

instalar();