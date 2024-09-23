Olá, recrutadores! 👋

Primeiramente, gostaria de agradecer pela oportunidade de participar deste processo seletivo e por dedicar o tempo para avaliar o meu trabalho. Foi um grande prazer desenvolver este projeto e contribuir com a solução que vocês solicitaram. Embora o tempo para desenvolvimento tenha sido limitado, consegui atender a todos os requisitos propostos, mantendo a aplicação 100% funcional. Espero que a solução apresentada esteja à altura das expectativas.

## Descrição do Projeto

Este repositório está organizado em três principais diretórios, cada um responsável por uma parte da aplicação:

1. **Backend (PHP)**: Este diretório contém a API desenvolvida utilizando PHP puro. Ela é responsável por gerenciar as operações CRUD, conectando-se ao banco de dados MySQL.
   
2. **Frontend (Angular)**: O diretório `crud-teste` contém o frontend desenvolvido em Angular. A interface foi projetada para consumir os serviços da API, garantindo uma experiência de usuário simples e eficiente.
   
3. **Banco de Dados (MySQL)**: O diretório `db-mysql` contém os scripts para criação e configuração do banco de dados MySQL. Ele está estruturado para suportar todas as operações necessárias à aplicação.

## Como rodar o projeto

### Pré-requisitos

- PHP (versão 7.x ou superior)
- MySQL
- Node.js e Angular CLI
- Servidor local, como Apache ou Nginx

### Passo a passo

1. **Clonar o repositório**:
   ```bash
   git clone [link do repositório]
   cd [nome do diretório]
   ```

2. **Configurar o banco de dados**:
   - Importar o arquivo SQL localizado em `db-mysql/` para seu MySQL.

3. **Iniciar o backend**:
   - Navegue até o diretório do backend:
     ```bash
     cd backend-php/
     ```
   - Inicie o servidor PHP:
     ```bash
     php -S localhost:8000
     ```

4. **Iniciar o frontend**:
   - Navegue até o diretório do frontend:
     ```bash
     cd crud-teste
     ```
   - Instale as dependências:
     ```bash
     npm install
     ```
   - Inicie o servidor Angular:
     ```bash
     ng serve
     ```

5. **Acessar a aplicação**:
   - Acesse o frontend pelo navegador: `http://localhost:4200`
   - O backend estará disponível em: `http://localhost:8000`
