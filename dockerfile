FROM node:21.7.0-bullseye
RUN mkdir /app
WORKDIR /app
COPY . /app
RUN cd /app && npm install
ENTRYPOINT [ "npm", "run", "start"]