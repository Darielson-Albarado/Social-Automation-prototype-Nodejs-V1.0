# Social-Automation-prototype-Nodejs-V1.0
## Autor
- Name: Darielson Albarado
- Country: Brazil
## Date
- 2022

## Languages
[English](#english) | [Portuguese](#portuguese)

## English

The Prototype of Social Media Automation and Advanced Web Scraping aims to increase the level of efficiency of Web Scraping techniques for didactic purposes. Much is known about libraries like Curl (Php) or Axios (Nodejs), however, web scraping goes far beyond that. When using standard libraries like these, many pieces of information are leaked when making queries, and we don't even realize it! The Curl in PHP, by default, usually sets the User-Agent to something like "PHP/{PHP version} (cURL/{cURL version})”. It is easily possible to set another User-Agent similar to a real browser, such as for example “Mozilla/5.0 (Linux; Android 6.0.1; Nexus 5X Build/MMB29P) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/W.X.Y.Z Mobile Safari/537.36 (compatible; Google-InspectionTool/1.0)”, with this it will already be possible to access many sites, but this is just the tip of the iceberg. When it comes to big companies like social networks, engineers and developers from these companies work hard to prevent automated access. Therefore, advanced techniques must be employed to make HTTP requests without being blocked! For this reason, there are many deep details introduced in this prototype. The goal is not to achieve 100% success in requests (which is almost impossible), but something around 70% is quite acceptable!

## Installation
To install this prototype, run the following commands in the terminal:

```bash linux
git clone https://github.com/Darielson-Albarado/Social-Media-Automation-Prototype-Nodejs
```

#### Go to the main folder and run the installation
```bash
npm run start
```

#### Usage example script: exemples/logininstagram.js
```bash
node .\logininstagram.js
```

## Documentation

### Main libraries puppeteer-extra and puppeteer-extra-plugin-stealth:
– Enhanced Puppeteer library. Functionalities:
  – Avoid detection by Puppeteer.
  - Avoid sending server information in HTTP requests.
  - Prevent leakage of server information within the Browser's driver and within the Browser's Dev Tools Kits.

#### References:
https://github.com/berstend/puppeteer-extra
https://github.com/berstend/puppeteer-extra/tree/master/packages/puppeteer-extra-plugin-stealth

### Functionalities of integrated external APIs:
- Implementation with the scrapeops.io API. Functionality: 
  - Download customized header patterns that will be checked and updated with the next API (httpbin).
- Implementation with the httpbin.org API. Creation and verification of dynamic Headers, identical to the originals of each Browser version. Functionalities:
  - Verification and update of the Header.
  - Structuring and correct order of the Header parameters.
- Implementation with the proxy.webshare.io API. Functionality:
  - Returns a list of paid proxies (10 free proxies trial).

### Prototype functionalities
- Create accounts on social networks automatically.
- Access websites automatically (Web Scraping).
- Simulate web navigation of a real device.
- Possibility to implement commands via RESTful API (requires implementation).

## Portuguese

O Protótipo de Automação de Redes Sociais e Web Scraping Avançado, tem como propósito aumentar o nível de eficiência das técnicas de Web Scraping para fins didáticos. Muito se conhece sobre bibliotecas como Curl (Php) ou Axios (Nodejs), porém, o web scraping vai muito além disso. Quando se utiliza bibliotecas padrões como essas, muitas informações são vazadas ao fazer as consultas; e nós nem mesmo percebemos! O Curl no PHP, por padrão normalmente seta o User-Agent: sendo algo como "PHP/{versão do PHP} (cURL/{versão do cURL})”. É possível facilmente setar outro User-Agent semelhante à um navegador real, como por exemplo “Mozilla/5.0 (Linux; Android 6.0.1; Nexus 5X Build/MMB29P) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/W.X.Y.Z Mobile Safari/537.36 (compatible; Google-InspectionTool/1.0)”, com isso já será possível acessar muitos sites, porém, isto é apenas a ponta do Iceberg. Quando se trata de grandes empresas como de redes sociais, engenheiros e desenvolvedores dessas empresas trabalham arduamente para prevenir acessos automatizados. Sendo assim, técnicas avançadas devem ser trabalhadas para se conseguir fazer solicitações HTTP sem ter o acesso bloqueado! Por isso, existem muitos detalhes profundos que introduzi neste protótipo. O objetivo não é conseguir 100% de sucesso nas solicitações (o que é quase impossível), porém, algo em torno de 70% já é bastante aceitável!

## Instalação
Para instalar este protótipo execute os seguintes comandos no terminal:

```bash linux
git clone https://github.com/Darielson-Albarado/Social-Media-Automation-Prototype-Nodejs
```

#### Vá até a pasta principal e execute a instalação
```bash
npm run start
```

#### Script de exemplo de utilização exemples/logininstagram.js
```bash
node .\logininstagram.js
```

## Documentação

### Bibliotecas principais puppeteer-extra e puppeteer-extra-plugin-stealth:
– Biblioteca Puppeteer “melhorada”. Funcionalidades: 
  – Evitar a detectação do puppeteer
  - Evitar envio de informações do servidor nas solicitações HTTP
  - Evitar vazamento de informações sobre o servidor dentro do driver do Browser e dentro do Dev Tools Kits do Browser.

Referências:
https://github.com/berstend/puppeteer-extra
https://github.com/berstend/puppeteer-extra/tree/master/packages/puppeteer-extra-plugin-stealth

### Funcionalidades das APIs externas integradas:
- Implementação com a API scrapeops.io. Funcionalidade: 
  - Baixar padrões de headers customizados que serão verificados e atualizados com a próxima API (httpbin).
- Implementação com a API httpbin.org. Criação e verificação de Headers dinâmicos, idênticos aos originais de cada versão do Navegador. Funcionalidades:
  - Verificação e atualização do Header.
  - Estruturação e ordem correta dos parâmetros do Header.
- Implementação com a API proxy.webshare.io. Funcionalidade: 
  - Retorna lista de proxys pagos (teste gratuito de 10 proxys).

### Funcionalidades do protótipo
- Criar contas em redes sociais de forma automatizada.
- Acessar sites de forma automatizada (Web Scraping).
- Simular a navegação web de um dispositivo real.
- Possibilidade de implementar comandos via API RESTful (requer implementação).