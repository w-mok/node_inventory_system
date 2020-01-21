FROM node:12.14-stretch-slim

WORKDIR /treez

ADD package.json .
ADD package-lock.json .

RUN npm install

RUN npm install -g knex

ADD . .

EXPOSE 1337

CMD ["npm", "start"]