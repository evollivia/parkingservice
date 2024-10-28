FROM node:18.20.4-alpine3.20
WORKDIR /app

COPY package*.json .
RUN npm install

COPY public ./public
COPY app.js .

EXPOSE 3000

CMD ["node", "app.js"]