FROM node:20.11.1

WORKDIR /src
COPY package*.json ./
RUN npm ci
COPY . .
CMD ["node","app.js"]
EXPOSE 80
