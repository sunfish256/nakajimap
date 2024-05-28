FROM node:16-alpine

WORKDIR /nakajimap

COPY nakajimap/package.json nakajimap/package-lock.json ./

RUN npm install

EXPOSE 3000
