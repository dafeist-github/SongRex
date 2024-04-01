FROM node:18-alpine AS builder
WORKDIR /app
COPY package*.json .
RUN npm ci
COPY . .
RUN npm run build
RUN npm prune --production

FROM node:18-alpine
WORKDIR /app
COPY --from=builder /app .
RUN npm install
ENV NODE_ENV=production
ENV SERVER_HOST=$SERVER_HOST
ENTRYPOINT [ "" ]
CMD ["node", "build"]