FROM node:20-alpine

WORKDIR /app

# Copia e installa le dipendenze del progetto principale
COPY package*.json ./
RUN npm install

# Copia e installa le dipendenze del server
RUN mkdir -p /app/server
COPY server/package*.json /app/server/
RUN cd /app/server && npm install

# Copia il resto del codice
COPY . .

# Compila il frontend
RUN npm run build

# Esponi le porte necessarie
EXPOSE 5000 5173

# Script di avvio
COPY start.sh /app/start.sh
RUN chmod +x /app/start.sh

CMD ["/app/start.sh"]