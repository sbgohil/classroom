FROM node:14.17.5

WORKDIR /src
COPY package.json ./
RUN npm i
COPY . .
CMD ["node","app.js"]
EXPOSE 80
