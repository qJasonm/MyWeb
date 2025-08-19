FROM node:20

WORKDIR /app

COPY package*.json tsconfig.json ./
RUN npm install
RUN npm install -g typescript
RUN npm install --save-dev @types/cors @types/express @types/node

COPY . .

RUN npx tsc

EXPOSE 3001

CMD ["node", "dist/ollamaME.js"]
