const puppeteerscrape = require("../assets/pupperteer");

// Objeto para chamar as instâncias de execução, pode ser implementado em JSON com uma APIREST de entrada
// É possível abrir diversos navegadores simultaneamente, porém, usar novas abas economiza o consumo de memória
const options = {
    type: {
      login: {
        newinstagram: true,
        verificarlogin: true,
      }
    },
    navegador: {
      tipo: "Chrome",
      total: 1
    },
    gethttpheaders: {
      server: "httpbin_org",
      total: 1
    },
    useproxy: true,
    salvarsessao: {
      status: true,
      savedb: true,
      formato: "json"
    },
    log: {
      show: true,
      write: true
    }
  }
  
  // Exemplo de chamada de execução
  const logininsta = new puppeteerscrape("marciosouz7", "irineu", options);
  logininsta.startscrape();