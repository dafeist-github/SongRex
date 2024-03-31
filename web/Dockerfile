FROM node:18-alpine AS builder
WORKDIR /app
COPY package*.json .
RUN npm ci
COPY . .
RUN npm run build
RUN npm prune --production
RUN ls && sleep 10

FROM node:18-alpine
WORKDIR /app
COPY --from=builder . .
ENV NODE_ENV=production
CMD ["npm", "run", "build"]