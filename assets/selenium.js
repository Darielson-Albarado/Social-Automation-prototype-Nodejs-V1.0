// Método de exemplo utilizando Selenium. Atenção: Não está completo, faltam muitos métodos, utilize apenas como base!
/*const { Builder, By, Key, until } = require('selenium-webdriver');
const webdriver = require('selenium-webdriver');
const fs = require('fs');
const path = require('path');
const dbfunctions = require('../dbfunctions');

// Constrói o caminho absoluto para o diretório raiz do projeto
const documentroot = path.join(__dirname, '/');

let driver = new Builder().forBrowser("chrome").build();

class logininstagram {
    constructor(username, password, options) {
        this.username = username;
        this.password = password;
        this.options = options;
        console.log(this.options);
    }

    async iniciar() {
        try {
            if (this.options.logar && this.options.verificarlogin) {

                let novologin = await this.novologin();
                
                if (novologin){
                await this.verificarsessao(this.username);
                }else{
                    return false;
                }
            } else if (!this.options.logar && this.options.verificarlogin) {
                await this.verificarsessao(this.username);
            }
        } catch (error) {
            console.log(`Erro ao iniciar ${error.message}`);
        }
    }

    async testarheaders(){
        const testar = await this.loadpages("teste", "http://httpbin.org/headers");
        console.log(testar);
    }

    async novologin() {
        // Carregar página de login
        console.log('Carregando página de login');
        const carregarlogin = await this.loadpages("Entrar • Instagram", "https://www.instagram.com/accounts/login/?force_authentication=1");

        if (carregarlogin) {
            // Enviar formulário
            console.log('Página de login carregada');
            console.log('Efetuar login');
            const sessaologin = await this.efetuarlogin();

            if (sessaologin){
               // Verificar se está logado
            }
        }else{
            return false;
        }
    }

    async loadpages(title, url) {
        try {
            const navigationPromise = driver.get(url);

            // Aguarde a resolução da Promise retornada por driver.get(url)
            await navigationPromise;

            // Aguarde até que o estado de carregamento seja 'complete'
            await driver.wait(until.elementLocated(By.tagName('body')), 6000);

            return true;
        } catch (error) {
            console.log(`Erro em loadpages: ${error.message}`);
            throw error;
        }
    }

    async salvarsessao(){
        try{
        // Opção salvar cookies
        if (this.options.salvarcookies && this.options.salvarcookies.status){
            if (this.options.salvarcookies.savedb && this.options.salvarcookies.formato == "json"){
            // Salvar os cookies no banco de dados
            // Criar conexão
            const mysql = new dbfunctions();
            const conexao = await mysql.criarconexao();

            //salvar session
            const cookies = await driver.manage().getCookies();

            if (cookies.length > 0){
                console.log(cookies);
                return cookies;
            }else{
                return false;
            }
            }
        }
    }catch(error){
        return false;
    }
    }

    async efetuarlogin() {
        try {
            const timeoutInMilliseconds = 5000;
            console.log('Preenchendo formulários');

            const usernamePromise = driver.findElement(webdriver.By.name('username'));
            const passwordPromise = driver.findElement(webdriver.By.name('password'));

            await Promise.race([
                Promise.all([usernamePromise, passwordPromise]),
                new Promise((_, reject) => setTimeout(() => reject(new Error('Timeout ao aguardar os elementos')), timeoutInMilliseconds))
            ]);

            const sendusername = usernamePromise.then(element => element.sendKeys(this.username));
            const sendpasswd = passwordPromise.then(element => element.sendKeys(this.password));
            const sendclickbtlogin = driver.findElement(webdriver.By.xpath('//*[@id="loginForm"]/div/div[3]/button')).click();
            
            await Promise.race([
                Promise.all([sendusername, sendpasswd, sendclickbtlogin]),
                new Promise((_, reject) => setTimeout(() => reject(new Error('Timeout ao escrever formulário')), timeoutInMilliseconds))
            ]);

            driver.sleep(3000);
            return true;

        } catch (error) {
            console.error("Erro ao encontrar elementos:", error.message);
            return false;
        }
    }

    async scrapenomeusuario(xpaths){

    try{
        let userget = await driver.findElement(webdriver.By.xpath(xpaths));

        if (userget){
            return true;
        }else{
            return false;
        }

        }catch (error){
            console.error("Erro ao encontrar elementos:", error.message);
            return false;
        }
    }   

    async verificarsessao(username) {
        
        try{

         // Carregar página de login
        const paginadousuario = await this.loadpages(this.username + " • Instagram", "https://www.instagram.com/"+this.username);
        console.log('Acessando página do usuário '+this.username);

        if (paginadousuario) {
            // Enviar formulário
            console.log('Página do usuário carregada');
            console.log('Confirmando nome de usuário');
            
            const sessaologin = await this.scrapenomeusuario('//*[@id="mount_0_0_SI"]/div/div/div[2]/div/div/div[1]/div[1]/div[2]/div[2]/section/main/div/header/section/div[1]/a/h1');

            if (sessaologin){
                return true;
            }else{
                return false;
            }
            
        }else{
            return false;
        }   

        }catch (error){
            console.error("Erro ao encontrar elementos:", error.message);
            return false;
        }

        let userget = driver.findElement(webdriver.By.xpath('//*[@id="mount_0_0_o8"]/div/div/div[2]/div/div/div/div[1]/div[1]/div[2]/div[2]/section/main/div/header/section/div[1]/div[1]/div/div'));
        console.log(userget);
    }

}

// Configurar opções
const option = {
    logar: true,
    verificarlogin: true,
    salvarcookies: {
        status: true,
        savedb: true,
        formato: "json"
    }
}

const instanciaLogin = new logininstagram('marciosouz7', 'irineu', option);

//instanciaLogin.iniciar();
instanciaLogin.testarheaders(); */