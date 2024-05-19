const dbfunctions = require('../dbfunctions');
import('node-fetch').then((fetchModule) => {
    const fetch = fetchModule.default;

    // Agora você pode usar 'fetch' aqui
});
const request = require('request-promise');
const UAParser = require('ua-parser-js');
const accept_language_parser = require('accept-language-parser');

class browserheaders {
    constructor(options) {
        this.options = options;
        this.httpheaders = this.httpheaders();
        this.mysql = new dbfunctions();
        this.startoptins();
    }

    async startoptins() {
        // verificar opções de busca
        if (this.options) {
            if (this.options.setapi && this.options.setapi.apiscrapeopsio && this.options.setapi.apiscrapeopsio.resultcountlist) {

                const newapiapiscrapeopsio = await this.apiscrapeopsio();
                if (newapiapiscrapeopsio) {
                    console.log("Busca concluída");
                }
                return true;
            } else {
                console.log("Escolha as opções de entrada ");
                return false;
            }
        }
    }

    httpheaders() {
        const headersBrowser = {
            upgradeInsecureRequests: "upgrade-insecure-requests",
            userAgent: "user-agent",
            accept: "accept",
            secChUa: "sec-ch-ua",
            secChUaMobile: "sec-ch-ua-mobile",
            secChUaPlatform: "sec-ch-ua-platform",
            secFetchSite: "sec-fetch-site",
            secFetchMod: "sec-fetch-mod",
            secFetchUser: "sec-fetch-user",
            acceptEncoding: "accept-encoding",
            acceptLanguage: "accept-language"
        };
        return headersBrowser;
    }

    // Função para verificar se o JSON é válido
    isJSONValid(jsonString) {
        try {
            JSON.parse(jsonString);
            return true;
        } catch (error) {
            return false;
        }
    }

    // Função para obter e validar JSON de uma URL
    async getvalidjson(url) {
        console.log("Buscando JSON");
        try {
            const response = await fetch(url);
            const data = await response.json();

            if (this.isJSONValid(JSON.stringify(data))) {
                //console.log('Dados recebidos:', data);
                return data;
            } else {
                throw new Error('JSON inválido');
            }
        } catch (error) {
            console.error('Erro ao fazer a requisição:', error.message);
            throw error; // Propaga o erro para quem chamou a função
        }
    }

    // function obter headers atualizados httpbin.org

    async sendhttpbinorg(headers) {
        try {
            const options = {
                method: 'GET',
                url: 'http://httpbin.org/headers',
                headers: headers
            }

            const response = await request(options);
            if (response) {
                return JSON.parse(response);
            } else {
                return false;
            }

        } catch (error) {
            console.error('Erro ao fazer a requisição:', error.message);
            throw error; // Propaga o erro para quem chamou a função
        }

    }

    // Função para extrair o nome do navegador de 
    browserinfobyuseragent(userAgentString) {
        try {
            const parser = new UAParser();
            const result = parser.setUA(userAgentString).getResult();
            return result ? result : false;
        } catch (error) {
            console.log("Erro ao fazer parse no user agent", error.message);
            return false;
        }
    }

    async apiscrapeopsio() {
        try {
            //Obter arquivo json com headers
            const apiscrapeopsio = "https://headers.scrapeops.io/v1/browser-headers?api_key=b206ab29-5d99-4815-8723-e2c17a324ae3&num_results=" + this.options.setapi.apiscrapeopsio.resultcountlist;
            // acessar api json 
            let jsonData = await this.getvalidjson(apiscrapeopsio);
            // criar conexao ao bd

            const conexao = await this.mysql.criarconexao();

            for (const item of jsonData['result']) {

                // Verificar tipo de navegador
                if (item[this.httpheaders.userAgent]) {
                    const browserinfosbyuseragent = this.browserinfobyuseragent(item[this.httpheaders.userAgent]);

                    // testar com ua-parser-js
                    if (browserinfosbyuseragent) {
                        const browserinfos = browserinfosbyuseragent.browser;
                        const browsername = browserinfos.name;
                        const browserversion = browserinfos.version;
                        const saveallinfosbyuseragent = JSON.stringify(browserinfosbyuseragent);
                        toString(browsername, browserversion);

                        console.log("All infos ", browserinfos);

                        // Salvar headers da api apiscrapeopsio
                        const headerscrapeopsio = JSON.stringify(item);

                        // Verificar se header existe
                        const checkscrapeopsiohd = `Select * from scrapeops_io WHERE headers = '${headerscrapeopsio}'`;
                        const resolvequeryhd = await this.mysql.asyncquery(conexao, checkscrapeopsiohd, 'content');
                        // se não houver headers salvos
                        if (resolvequeryhd.length === 0) {
                            const queryvalues = {
                                        "headers": { item },
                                        "status": true,
                                        "useragent": item[this.httpheaders.userAgent],
                                        "browser": browsername,
                                        "browserversion": browserversion,
                                        "infosbyuseragent": saveallinfosbyuseragent
                                    };

                                    // Consulta SQL com placeholders "?" e valores correspondentes
                                    const sqlcode = `
  INSERT INTO scrapeops_io 
  (status, headers, useragent, browser, browserversion, infosbyuseragent)
  VALUES (?, ?, ?, ?, ?, ?)
`;

                                    console.log("Headers scrapt.io não existe, gravando novo");

                                    // Valores correspondentes aos placeholders
                                    const values = [
                                        queryvalues.status,
                                        JSON.stringify(queryvalues.headers.item),
                                        queryvalues.useragent,
                                        queryvalues.browser,
                                        queryvalues.browserversion,
                                        queryvalues.infosbyuseragent
                                    ];
                                    const insertdb = await this.mysql.insertquery(conexao, sqlcode, values, 'content');
                        } else {
                            console.log('já existe pulando...');
                        }

                        // Testar e salvar atualizar headers usando o site httpbin.org
                        // retornar headers atualizados
                        if (this.options.atualizarheaders && this.options.atualizarheaders.httpbin_org) {
                            const testarheader = await this.sendhttpbinorg(item);
                            // verificar headers
                            if (testarheader) {
                                // verificar se é um json válido
                                const testjson = JSON.stringify(testarheader);
                                if (!this.isJSONValid(testjson)) {
                                    console.error("Json invalido");
                                    continue;
                                }
                                // verificar se existe um indice host
                                if (testarheader.headers && testarheader.headers.Host) {
                                    delete testarheader.headers.Host;
                                }
                                // verificar se existe um indice X-Amzn-Trace-Id
                                if (testarheader.headers && testarheader.headers['X-Amzn-Trace-Id']) {
                                    delete testarheader.headers['X-Amzn-Trace-Id'];
                                }
                                // Converter json para string e salvar
                                const saveitem = testarheader;
                                //const saveitem = xsaveitem.replace(/\\/g, '\\\\');

                                const acptlanguage = accept_language_parser.parse(testarheader.headers['Accept-Language']);
                                
                                let regiao, linguagem;
                                
                                if (acptlanguage){
                                if (acptlanguage[0].region && acptlanguage[0].code){
                                    regiao = acptlanguage[0].region;
                                    linguagem = acptlanguage[0].code;
                                }else{
                                    continue;
                                }
                                }else{
                                    continue;
                                }

                                // verificar se useragent existe
                                const sqlcheckuseragent = `Select * from httpbin_org WHERE headers = '${saveitem}'`;
                                const resolvequery = await this.mysql.asyncquery(conexao, sqlcheckuseragent, 'content');
                                // se não houver headers salvos
                                if (resolvequery.length === 0) {
                                    // converter para json
                                    // Dados a serem inseridos
                                    const queryvalues = {
                                        "headers": { saveitem },
                                        "status": true,
                                        "useragent": item[this.httpheaders.userAgent],
                                        "browser": browsername,
                                        "browserversion": browserversion,
                                        "country_code": regiao,
                                        "linguagem": linguagem,
                                        "infosbyuseragent": saveallinfosbyuseragent,
                                        "infosbyaceptlang": acptlanguage
                                    };

                                    // Consulta SQL com placeholders "?" e valores correspondentes
                                    const sqlinsertnewheader = `
  INSERT INTO httpbin_org 
  (status, headers, useragent, browser, browserversion, country_code, linguagem, infosbyuseragent, infosbyaceptlang)
  VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
`;

                                    console.log("Headers httpbin.org não existe, gravando novo");

                                    // Valores correspondentes aos placeholders
                                    const values = [
                                        queryvalues.status,
                                        JSON.stringify(queryvalues.headers.saveitem.headers),
                                        queryvalues.useragent,
                                        queryvalues.browser,
                                        queryvalues.browserversion,
                                        queryvalues.country_code,
                                        queryvalues.linguagem,
                                        queryvalues.infosbyuseragent,
                                        JSON.stringify(queryvalues.infosbyaceptlang)
                                    ];
                                    const insertnewheader = await this.mysql.insertquery(conexao, sqlinsertnewheader, values, 'content');

                                    continue;
                                } else {
                                    console.log('já existe pulando...');
                                    continue;
                                }

                            } else {
                                continue;
                            }
                        }
                        continue;

                    } else {
                        continue;
                    }
                } else {
                    continue;
                }

            };
            this.mysql.encerrarconexao(conexao);
            return true;
        } catch (error) {
            console.log("Ocorreu um erro ao acessar a apiscrapeopsio", error.message);
            this.mysql.encerrarconexao(conexao);
            return false;
        }
    }

    // função para retornar headers
    async getheaderssaved(table, total, options) {
        const conexao = await this.mysql.criarconexao();
        // opções
        let browser;
        if (options && options.navegador && options.navegador.tipo == "Edge"){
            browser = `browser = 'Edge'`;
        }else if (options && options.navegador && options.navegador.tipo == "Chrome"){
            browser = `browser = 'Chrome'`;
        }else{
            return false;
        }
        try {

            const sqlquery = `SELECT * FROM ${table} WHERE ${browser} ORDER BY RAND() LIMIT ${total}`;
            
            const resolvequery = await this.mysql.asyncquery(conexao, sqlquery, 'content');

            // Se não houver headers salvos
            if (resolvequery.length === 0) {
                return false;
            } else {
                return resolvequery;
            }
        } catch (error) {
            console.error("Erro ao obter headers httpbin_org", error.message);
        } finally {
            if (this.mysql) {
                this.mysql.encerrarconexao(conexao);
            }
        }
    }


}

/*
const headeroptions = {
    setapi: {
        apiscrapeopsio: {
            resultcountlist: 200
        }
    },
    atualizarheaders: {
        httpbin_org: true
    }
}

getnewheaders = new browserheaders(headeroptions);


options = {
    navegador: {
        tipo: "Edge",
        total: 1
      }
}

const searchhttpsheaders = new browserheaders();
asdasd = searchhttpsheaders.getheaderssaved("httpbin_org", 1, options).then (resolve =>{
console.log(resolve[0]);
});*/

module.exports = browserheaders;

//searchhttpsheaders.getvalidjson("https://headers.scrapeops.io/v1/browser-headers?api_key=b206ab29-5d99-4815-8723-e2c17a324ae3&num_results=2");