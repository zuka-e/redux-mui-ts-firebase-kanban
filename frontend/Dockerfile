FROM node:13.10.1-alpine3.10

WORKDIR /usr/src/frontend

COPY package.json yarn.lock /usr/src/frontend/
RUN yarn install

COPY . /usr/src/frontend/

CMD ["yarn", "start"]
