FROM node:20-alpine

# Instalar Angular CLI
RUN npm install -g @angular/cli@19

WORKDIR /app

# Copiar package.json
COPY package*.json ./

# Instalar dependências
RUN npm install

# Copiar código
COPY . .

# Expor porta
EXPOSE 4200

# Comando para desenvolvimento
CMD ["ng", "serve", "--configuration", "development"]