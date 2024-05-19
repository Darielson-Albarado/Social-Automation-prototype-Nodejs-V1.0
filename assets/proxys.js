const axios = require("axios");
const dbfunctions = require("../dbfunctions");

class proxyes {
    constructor(options) {
        this.options = options;
        this.mysql = new dbfunctions();
    }

    // função para exibir ou gravar logs 
    log(message) {
        if (this.options.log && this.options.log.show) {
            console.log(message);
        }
    }

    async saveproxys(sqlvalues) {
        const conexao = await this.mysql.criarconexao();

        try {
            // Consulta SQL com placeholders "?" e valores correspondentes
            const sqlinsertnewheader = `INSERT INTO proxyes SET ?`;
            const insertdb = await this.mysql.insertquery(conexao, sqlinsertnewheader, sqlvalues, 'content');

            if (insertdb) {
                this.log("Proxy salvo");
            } else {
                this.log("Erro ao salvar proxy");
            }

        } catch (error) {
            this.log('Erro na requisição:', error.message);
        } finally {
            if (conexao) {
                this.mysql.encerrarconexao(conexao);
            }
        }

    }

    async buscarproxy(options) {
        let filters, ordem = "";
        const conexao = await this.mysql.criarconexao();

        try {
            if (options && options.ip) {
                filters = `WHERE proxyip = '${options.ip}'`;
            } else if (options && options.servidor) {
                filters = `WHERE servidor = '${options.servidor}'`;
            } else if (options && options.status) {
                filters = `WHERE status = ${options.status}`;
            } else if (options && options.country_code) {
                filters = `WHERE country_code = '${options.country_code}'`;
            }

            if (options && options.order == "rand"){
                filters = "";
                ordem = `ORDER BY RAND()`;
            }

            const select = `SELECT * from proxyes ${filters} ${ordem}`;

            const buscar = await this.mysql.asyncquery(conexao, select, 'content');

            if (buscar.length !== 0){
                this.log(buscar[0])
                return buscar[0];
            }else{
                return false;
            }

        } catch (error) {
            console.error('Erro na requisição:', error.stack);
        }finally{
            if (conexao){
                this.mysql.encerrarconexao(conexao);
            }
        }
    }

    async getbyserverwebshare_io() {

        const instance = axios.create({
            baseURL: 'https://proxy.webshare.io/api/v2/proxy/list/?mode=direct&page=1&page_size=25',
            headers: {
                Authorization: '3dh4oaefmm9ncs1us2zj9hjo28tcf9vylghcjy2f',
            },
        });

        try {
            this.log('Acessando api webshare_io');

            const response = await instance.get();

            if (response.data) {
                // fazer parse nos cookies
                this.log('Percorrendo proxys');
                for (const item of response.data.results) {
                    if (item.username && item.password && item.proxy_address
                        && item.port && item.valid && item.country_code && item.city_name) {

                        // verificar ip
                        const search = {
                            ip: item.proxy_address
                         }

                         this.log("Verificando se existe");
                        const verificarip = await this.buscarproxy(search);

                        if (verificarip){
                            this.log(`Proxy ${item.proxy_address} já existe`);
                            continue;
                        }

                        // Dados a serem inseridos
                        const sqlvalues = {
                            "status": true,
                            "liberado": true,
                            "servidor": "webshare.io",
                            "proxyip": item.proxy_address,
                            "username": item.username,
                            "password": item.password,
                            "port": item.port,
                            "country_code": item.country_code,
                            "city_name": item.city_name,
                            "lastacess": "",
                            "usedby": "",
                            "moreinfo": ""
                        };

                        const saveproxy = await this.saveproxys(sqlvalues);

                        if (saveproxy) {
                            this.log("Salvo" + item);
                        }


                    }

                }

            } else {
                return false;
            }
        } catch (error) {
            console.error('Erro na requisição:', error.message);
        }

    }
}

options = {
    savenews: {
        servers: ["webshare.io"]
    },
    log: {
        show: true
    }
}

module.exports = proxyes;

//const proxy = new proxyes(options);
//proxy.getbyserverwebshare_io();