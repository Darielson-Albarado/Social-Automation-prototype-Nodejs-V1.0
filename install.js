const dbfunctions = require('./dbfunctions.js');

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
    console.log('Banco de dados e tabelas criados com sucesso!');
  }).then(() => {
    instalar.criartabelaheadershttp();
  }).then(() => {
    instalar.criartabelasproxy();
  });
}

instalar();