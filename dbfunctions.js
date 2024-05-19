const mysql = require('mysql');

class dbfunctions {
  constructor(options) {
    this.options = options;
    this.databaseName = "socialautomation";
  }

  async criarconexao() {

    const authdb = {
      host: 'localhost',
      user: 'root',
      password: 'root',
      database: this.databaseName
    };

    // Conectar ao banco de dados
    try {
      const conectionid = await this.newconection(authdb);
      console.log('Conectado');
      return conectionid;

    } catch (error) {
      console.error("Erro ao conectar ao banco de dados: " + this.databaseName, error.message);
      throw error;  // Adiciona o throw para interromper a execução em caso de erro
    } finally {

    }
  }

  // Encerrar conexão
  encerrarconexao(conectionid) {
    try {
      conectionid.end((err) => {
        if (err) {
          console.error('Erro ao encerrar a conexão:', err);
        } else {
          console.log('Conexão encerrada com sucesso.');
        }
      });
    } catch (error) {
      console.error("Erro ao encerrar conexão: " + this.databaseName, error.message);
      throw error;  // Adiciona o throw para interromper a execução em caso de erro
    }
  }

  async criarbancodedados() {
    // Criar o banco de dados se não existir
    console.log('Iniciando instalação do bd...');

    const primeiraconexao = {
      host: 'localhost',
      user: 'root',
      password: 'root',
      port: 3306
    }

    try {
      console.log("Conectando ao servidor sql");
      const conectionid = await this.newconection(primeiraconexao);

      console.log("Criando bando de dados " + this.databaseName);

      const resultadonewbd = await this.asyncquery(conectionid, `CREATE DATABASE IF NOT EXISTS ${this.databaseName} CHARACTER SET utf8mb4 
      COLLATE utf8mb4_unicode_ci;`);

      if (resultadonewbd) {
        console.log("Banco de dados Criado " + this.databaseName);
      }
      this.encerrarconexao(conectionid);
    } catch (error) {
      console.error('Erro ao criar o banco de dados:', error);
      this.encerrarconexao(conectionid);
      throw error;  // Adiciona o throw para interromper a execução em caso de erro
    } finally {

    }
  }

  async newconection(authdb) {

    // Informações do bd
    const connectionid = mysql.createConnection(authdb);

    return new Promise((resolve, reject) => {
      connectionid.connect((err) => {
        if (err) {
          console.error('Erro ao conectar ao banco de dados:', err);
          reject(err);
        } else {
          resolve(connectionid);
        }
      });
    });
  }

  async asyncquery(connection, sql, returntype) {
    return new Promise((resolve, reject) => {
      connection.query(sql, (err, results) => {
        if (err) {
          console.error(`Erro ao executar a query: ${sql}`, err);
          reject(err);
        } else {
          // console.log(`Query executada com sucesso. Resultados: ${JSON.stringify(results)}`);
          if (returntype == 'content') {
            resolve(results);
          } else {
            resolve(true);
          }
        }
      });
    });
  }

  async insertquery(connection, sql, values, returntype) {
    return new Promise((resolve, reject) => {
      connection.query(sql, values, (err, results) => {
        if (err) {
          console.error(`Erro ao executar a query: ${sql}`, err);
          reject(err);
        } else {
          // console.log(`Query executada com sucesso. Resultados: ${JSON.stringify(results)}`);
          if (returntype == 'content') {
            resolve(results);
          } else {
            resolve(true);
          }
        }
      });
    });
  }

  // Encerrar conexão
  encerrarconexao(connection) {
    connection.end((err) => {
      if (err) {
        console.error('Erro ao encerrar a conexão:', err);
      } else {
        console.log('Conexão encerrada com sucesso.');
      }
    });
  }

  // Criar tabelas
  async criartabelas() {
    try {
      // Nome das tabelas
      const tablename = this.options.criartabela;

      // Criar coneção
      const conexao = await this.criarconexao();

      // Percorrer nome das tabelas e criar coluna
      for (const chave of Object.keys(tablename)) {
        if (tablename.hasOwnProperty(chave)) {
          let nomedatabela = tablename[chave];

          // Criar o banco de dados se não existir
          console.log(`Criando tabela ${nomedatabela}`);

          // Sql
          const querynovatabela = `
      CREATE TABLE IF NOT EXISTS ${nomedatabela} (
        id INT AUTO_INCREMENT PRIMARY KEY,
        status BOOLEAN,
        username VARCHAR(100),
        password VARCHAR(100),
        email VARCHAR(100),
        name VARCHAR(100),
        phone VARCHAR(100),
        headers JSON,
        cookies JSON
      );
    `;

          const checktable = `Select * from table ${nomedatabela}`;

          // executar query
          //console.log("query ", querynovatabela);
          const resolvequery = await this.asyncquery(conexao, querynovatabela);

          if (resolvequery) {
            console.log(`A tabela ${nomedatabela} foi criada!`);
          } else {
            console.log(`Não foi possível criar a tabela ${nomedatabela} foi criada!`);
          }

        }
        continue;
      }

      this.encerrarconexao(conexao);
      return true;
    } catch (error) {
      console.error('Erro ao executar a query:', error);
      this.encerrarconexao(conexao);
      throw error;  // Adiciona o throw para interromper a execução em caso de erro
    }
  }

  async criartabelaheadershttp() {

    try {

      const conexao = await this.criarconexao();

      let querys = [];
      // Sql criar tabela httpbin.org
      const querynovatabela = `
      CREATE TABLE IF NOT EXISTS httpbin_org (
        id INT AUTO_INCREMENT PRIMARY KEY,
        status BOOLEAN,
        headers TEXT,
        useragent VARCHAR(500),
        browser VARCHAR(200),
        browserversion VARCHAR(300),
        country_code VARCHAR(300),
        linguagem VARCHAR(300),
        infosbyuseragent TEXT,
        infosbyaceptlang TEXT
      );
    `;
      querys.push(querynovatabela);

      // Sql criar tabela scrapeops.io
      const querynovatabela2 = `
    CREATE TABLE IF NOT EXISTS scrapeops_io (
      id INT AUTO_INCREMENT PRIMARY KEY,
      status BOOLEAN,
      headers TEXT,
      useragent VARCHAR(500),
      browser VARCHAR(200),
      browserversion VARCHAR(300),
      infosbyuseragent TEXT
    );
  `;
    querys.push(querynovatabela2);


      //executar
      for (const item of querys) {
        const resolvequery = await this.asyncquery(conexao, item);

        if (resolvequery) {
          console.log(`Tabela criada!`);
          continue;
        } else {
          error.log('Erro ao criar tabela ' + item);
          throw new error("Erro aos criar tabelas httpheaders");
        }

      }
      this.encerrarconexao(conexao);
      return true;
    } catch (error) {
      this.encerrarconexao(conexao);
      error.log(error.message);
    }

  }

  async criartabelasproxy() {

    try {

      const conexao = await this.criarconexao();

      let querys = [];
      // Sql criar tabela httpbin.org
      const querynovatabela = `
      CREATE TABLE IF NOT EXISTS proxyes (
        id INT AUTO_INCREMENT PRIMARY KEY,
        status BOOLEAN,
        liberado BOOLEAN,
        servidor VARCHAR(200),
        proxyip VARCHAR(300),
        username TEXT,
        password TEXT,
        port INT,
        country_code VARCHAR(300),
        city_name VARCHAR(300),
        lastacess VARCHAR(500),
        usedby TEXT,
        moreinfo TEXT
      );
    `;
      querys.push(querynovatabela);

      //executar
      for (const item of querys) {
        const resolvequery = await this.asyncquery(conexao, item);

        if (resolvequery) {
          console.log(`Tabela de Proxies criada!`);
          continue;
        } else {
          error.log('Erro ao criar tabela ' + item);
          throw new error("Erro aos criar tabelas httpheaders");
        }

      }
      this.encerrarconexao(conexao);
      return true;
    } catch (error) {
      this.encerrarconexao(conexao);
      error.log(error.message);
    }

  }

}

module.exports = dbfunctions;