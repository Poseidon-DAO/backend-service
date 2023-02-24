FROM node:16 as builder
LABEL maintainer="Patrick Jusic <patrick.jusic@poseidondao.org>"

WORKDIR /usr/src/app

COPY ./package.json .
COPY ./yarn.lock .
RUN yarn install

COPY . . 

RUN yarn run prisma:generate
RUN yarn run build


FROM node:16-slim

WORKDIR /root/app

RUN npm install -g ts-node

COPY --from=builder /usr/src/app/package.json ./package.json
COPY --from=builder /usr/src/app/tsconfig.prod.json ./tsconfig.json
COPY --from=builder /usr/src/app/node_modules ./node_modules
COPY --from=builder /usr/src/app/prisma ./prisma
COPY --from=builder /usr/src/app/dist ./dist

RUN mkdir logs

EXPOSE 3000

CMD ["ts-node", "-r", "tsconfig-paths/register", "dist/server.js"]