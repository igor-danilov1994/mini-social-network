FROM node:19.5.0-alpine

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

EXPOSE 3000

CMD ["npm", "start"]

## docker build -t mini-express-server .
## docker compose up --build
