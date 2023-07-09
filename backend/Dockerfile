FROM node:alpine

WORKDIR /app

COPY ./package.json /app

RUN npm install

COPY . /app

ENV PORT=3030

EXPOSE 3030

CMD ["npm","start"]

