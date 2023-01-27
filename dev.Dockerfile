FROM node:16
LABEL maintainer="Patrick Jusic <patrick.jusic@poseidondao.org>"

WORKDIR /usr/src/app

COPY ./package.json .
COPY ./yarn.lock .
RUN yarn install

RUN mkdir logs

COPY . . 

EXPOSE 3000

CMD ["yarn", "run", "dev"]