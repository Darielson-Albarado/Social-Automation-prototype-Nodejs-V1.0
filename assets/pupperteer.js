const puppeteer = require('puppeteer-extra')
// add stealth plugin and use defaults (all evasion techniques)
const StealthPlugin = require('puppeteer-extra-plugin-stealth')
puppeteer.use(StealthPlugin());
const browserheaders = require("./browserheaders");
const proxyes = require("./proxys");
const countrylanguage = require('country-language');
const languageTags = require('language-tags');

class puppeteerscrape {
  constructor(emailorusername, password, options) {
    this.emailorusername = emailorusername;
    this.password = password;
    this.options = options;
    this.openedbrowsers;
    this.browserheaders = new browserheaders();
    this.proxyes = new proxyes({ log: true });
  }

  async startscrape() {

    // verificar tipo de navegador e total
    if (this.options.navegador) {

      const abrirtotaldenavegadores = (this.options.navegador.total && this.options.navegador.total > 0) ? this.options.navegador.total : 1;
      // abrir navegadores
      this.openedbrowsers = await this.openbrowsers(abrirtotaldenavegadores);

    }

    // veriricar se navegadores foram abertos
    const navegadoresdoresabertos = await this.gettotalbrowserabertos(this.openedbrowsers);

    // Verificar tipo de scrapt e se navegadores foram abertos
    if (navegadoresdoresabertos > 0) {

      if (this.options.type && this.options.type.login && this.options.type.login.newinstagram) {
        this.log("Iniciando novo login instagram");
        const statuslogin = await this.logininstagram();
      }

    }

  }

  // função para exibir ou gravar logs de erros customizados
  log(message) {
    if (this.options.log && this.options.log.show) {
      console.log(message);
    }
  }

  logerror(message) {
    if (this.options.log && this.options.log.show) {
      console.error(message);
    }
  }

  async openbrowsertype() {
    try {
      if (this.options.navegador && this.options.navegador.tipo == "Chrome" && this.options.useproxy) {
        // Abrir navegador e configurar proxy 
        // Escolher Proxy

        const serachproxyoptions = {
          order: "rand"
        }

        const randomproxy = await this.proxyes.buscarproxy(serachproxyoptions);
        this.log(randomproxy);
        let browser = false;
        if (randomproxy.proxyip && randomproxy.port && randomproxy.username && randomproxy.password) {
          const proxyUrl = randomproxy.proxyip + ":" + randomproxy.port;
          //const username = randomproxy.username;
          //const password = randomproxy.password;

          this.log(`Proxy utilizado: ${proxyUrl}`);
          browser = await puppeteer.launch({
            executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
            headless: false,
            args: [`--proxy-server=${proxyUrl}`]
          });
          browser.proxyinfo = randomproxy;
        } else {
          return false;
        }

        if (browser) {
          return browser;
        } else {
          return false;
        }
      }
    } catch (error) {
      this.logerror(error.message);
    }
  }

  // Abrir navegadores se não estiver aberto!
  async openbrowsers(total) {
    try {
      const browsers = [];
      this.log("Abrindo " + total + " navegadores");
      for (let i = 0; i < total; i++) {
        let browser = await this.openbrowsertype();
        if (browser) {
          browsers.push(browser);
          this.log(`Navegador ${i + 1} aberto`);
        } else {
          this.logerror(`Navegador ${i + 1} não abriu`);
          continue;
        }
      }
      if (browsers.length > 0) {
        return browsers;
      } else {
        return false;
      }

    } catch (error) {
      this.log(error.message);
    }
  }

  // Verificar se browsers estão abertos
  async isBrowserOpen(browser) {
    try {
      return browser.isConnected(); // Retorna true se o navegador estiver aberto, false se estiver fechado
    } catch (error) {
      this.log(error.message);
    }
  }

  // Retornar total de browsers abertos
  async gettotalbrowserabertos() {
    try {
      let openbrowsers = 0;
      this.log("Verificando browsers abertos");
      for (const browser of this.openedbrowsers) {
        // chamar função de verificação
        const idbrowser = await this.isBrowserOpen(browser);

        if (idbrowser) {
          openbrowsers++;
        }
      }

      if (this.openedbrowsers.length <= 0) {
        this.log("Nenhum navegador está aberto.");
        return false;
      } else {
        this.log("Total de navegadores abertos = " + openbrowsers);
        return openbrowsers;
      }
    } catch (error) {
      this.log(error.message);
      return false;
    }
  }

  fecharnavegador(browser) {
    try {
      browser.close;
    } catch (error) {
      this.log(error.message);
    }
  }

  // função de browsers, obter novos, acessar etc...
  async getbrowserheaders() {

    try {
      if (this.options.gethttpheaders && this.options.gethttpheaders.server) {
        const serverheaders = this.options.gethttpheaders.server;
        const totalget = parseInt(this.options.gethttpheaders.total);

        this.log("Buscando heraders " + serverheaders);
        const getheaders = await this.browserheaders.getheaderssaved(serverheaders, totalget, this.options);
        if (getheaders) {
          return getheaders[0];
        } else {
          this.log("Erro ao acessar headers " + serverheaders);
          return false;
        }

      } else {
        this.log("Getgeaders não é um array válido!");
        return false;
      }
    } catch (error) {
      this.log(error.message);
      return false;
    }

  }

  // Função retornar código do idioma
  getcountrylang(countryCode) {
    const languages = countrylanguage.getCountryLanguages(countryCode);

    if (languages.length > 0) {
      if (languages[0]['iso639_1']){
        return languages[0]['iso639_1'];
    } else {
        return false;
    }
   }
  }

  async getpage(url) {
    // função para acessar páginas
    try {
      // Obter id do navegador
      let infoacesso;

      for (const idnavegador of this.openedbrowsers) {
        const browser = idnavegador;

        this.log(browser);

        // Setar headers
        this.log("Configurando headers");
        // Configurando os headers

        //Obter header aleatório
        this.log("Carregando headers...");
        const data = await this.getbrowserheaders();
        const headerid = data.id;
        this.log("Usando headers: " + data.headers);
        const headers = JSON.parse(data.headers);
        const useragent = headers['User-Agent'];
        //delete headers['User-Agent'];

        //await page.setExtraHTTPHeaders(headers);

        // Abrir nova aba
        this.log("Abrindo nova aba");
        const page = await browser.newPage();
        await page.setUserAgent(useragent);
        // Autenticar proxys se houver
        this.log(browser.proxyinfo);
        if (options && options.useproxy && browser.proxyinfo && browser.proxyinfo.username
          && browser.proxyinfo.password) {
          const proxyuser = browser.proxyinfo.username;
          const proxypasswd = browser.proxyinfo.password;
          const proxyip = browser.proxyinfo.proxyip;
          const countrycode = browser.proxyinfo.country_code.toUpperCase();
          const countrycodeminusc = browser.proxyinfo.country_code.toLowerCase();

          this.log(`Autenticando proxy ip ${proxyip} user ${proxyuser} passwd ${proxypasswd}`);

          // Autenticar proxye
          const authproxy = await page.authenticate({ username: proxyuser, password: proxypasswd });

          // Configurar Accept-Language de acordo com idioma do proxy
          if (countrycode.length > 0){
          // Retornar codigo iso389_1 com idioma da região
          const countryiso639_1 = this.getcountrylang(countrycode);

          if (countryiso639_1){
          // converter para minusculo
          countryiso639_1.toLowerCase();
          // Adicionar dados ao header
          const taglang = `${countryiso639_1}-${countrycode}`;
          // Verificar se tag de idioma é válido
          if (languageTags(taglang).valid()) {
            this.log("Tag de idioma utilizado "+taglang);
            headers['Accept-Language'] = `${taglang},${countrycodeminusc};q=0.9`;
          }else{
            this.logerror("Tag de idioma inválido!");
          }
          
          }else{
            this.logerror("Erro ao identificar Country Code!");
          }
          }else{
            this.logerror("Proxy sem Country Code!");
          }
        }

        // Habilitar intercepção para conseguir alterar o Header Padrão do Driver
        await page.setRequestInterception(true);
        // Alterar header após abrir um evento de requisição (abertura de página)
        page.on('request', request => {
          // Não faça nada em caso de solicitações que não sejam de navegação.
          if (!request.isNavigationRequest()) {
            request.continue();
            return;
          }
          // Add headers customizados
          
          //const headers = request.headers();
          //headers['Accept-Language'] = "pt-BR,br;q=0.9";
          request.continue({ headers });
        });

        this.log("Navegador aberto!");
        // Navega para uma URL
        this.log("Acessando página! " + url);
        await page.goto(url);
        this.log("Página carregada! " + url);
        // Tira uma captura de tela
        //await page.screenshot({ path: 'example.png' });
        if (page) {
          browser.paginaaberta = page;
        } else {
          browser.paginaaberta = false;
        }
      }
      // Fecha o navegador
      // await browser.close();
    } catch (error) {
      this.log(error.message);
      return false;
    }
  }

  async logininstagram() {

    // acessar página de login do insta
    const pageinsta = await this.getpage("https://www.instagram.com/accounts/login/?force_authentication=1");
    //const pageinsta = await this.getpage("http://httpbin.org/headers");

    if (pageinsta) {
      this.log("Concluido");
    }
  }

}

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
const logininsta = new puppeteerscrape("asdasd", 1238912, options);
logininsta.startscrape();