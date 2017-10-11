FROM node:8.6.0

WORKDIR /app

ADD . /app

ENV LOG_LEVEL info

RUN npm install
RUN npm run tsc-build

EXPOSE 8000

CMD ["npm", "run", "app-start"]
