FROM node:8.6.0

WORKDIR /app

ADD . /app

ENV NODE_ENV production

RUN npm install
RUN npm run tsc-build

EXPOSE 8000

CMD ["npm", "start"]
