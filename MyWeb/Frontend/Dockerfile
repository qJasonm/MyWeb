# Build stage
FROM node:20 AS builder
WORKDIR /app
COPY . .
ARG VITE_OLLAMA_URL
ENV VITE_OLLAMA_URL=$VITE_OLLAMA_URL
RUN npm install
RUN npm run build

# Serve stage (static)
FROM node:20-alpine
WORKDIR /app
RUN npm install -g serve
COPY --from=builder /app/dist ./dist
EXPOSE 4173
CMD ["serve", "-s", "dist", "-l", "4173"]
