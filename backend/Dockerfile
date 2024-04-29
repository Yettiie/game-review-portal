FROM node:14-alpine

WORKDIR /app

COPY package*.json ./

RUN npm install

# Copy all files from current directory to container
COPY . .

EXPOSE 5000

CMD ["node", "server.js"]
