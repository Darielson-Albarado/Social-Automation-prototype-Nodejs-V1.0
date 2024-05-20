# Social-Automation-prototype-Nodejs-V1.0


[English](#english) | [Portuguese](#portuguese)


## English


Social Media Automation and Advanced Web Scraping Prototype.


## Portuguese


O Protótipo de Automação de Redes Sociais e Web Scraping Avançado, tem como propósito aumentar o nível de eficiência das técnicas de Web Scraping para fins didáticos. Muito se conhece sobre bibliotecas como Curl (Php) ou Axios (Nodejs), porém, o web scraping vai muito além disso. Quando se utiliza bibliotecas padrões como essas, muitas informações são vazadas ao fazer as consultas; e nós nem mesmo percebemos! O Curl no PHP, por padrão normalmente seta o User-Agent: sendo algo como "PHP/{versão do PHP} (cURL/{versão do cURL})”. É possível facilmente setar outro User-Agent semelhante à um navegador real, como por exemplo “Mozilla/5.0 (Linux; Android 6.0.1; Nexus 5X Build/MMB29P) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/W.X.Y.Z Mobile Safari/537.36 (compatible; Google-InspectionTool/1.0)”, com isso já será possível acessar muitos sites, porém, isto é apenas a ponta do Iceberg. Quando se trata de grandes empresas como de redes sociais, engenheiros e desenvolvedores dessas empresas trabalham arduamente para prevenir acessos automatizados. Sendo assim, técnicas avançadas devem ser trabalhadas para se conseguir fazer solicitações HTTP sem ter o acesso bloqueado! Por isso, existem muitos detalhes profundos que introduzi neste protótipo. O objetivo não é conseguir 100% de sucesso nas solicitações (o que é quase impossível), porém, algo em torno de 70% já é bastante aceitável!


### Bibliotecas principais puppeteer-extra e puppeteer-extra-plugin-stealth:
– Biblioteca Puppeteer “melhorada”. Funcionalidades: 
 – Evitar a detectação do puppeteer
 - Evitar envio de informações do servidor nas solicitações HTTP
 - Evitar vazamento de informações sobre o servidor dentro do driver do Browser e dentro do Dev Tools Kits do Browser.


Referências:
berstend/puppeteer-extra: 💯 Ensine novos truques ao marionetista através de plugins. (github.com)
puppeteer-extra/packages/puppeteer-extra-plugin-stealth at master · berstend/puppeteer-extra (github.com)


### Funcionalidades das APIs externas integradas:
- Implementação com a API scrapeops.io. Funcionalidade: 
  - Baixar padrões de headers customizados que serão verificados e atualizados com a próxima API httpbin.
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