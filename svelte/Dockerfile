FROM node:18-alpine AS builder
WORKDIR /app
ARG VITE_SERVER_HOST
ENV VITE_SERVER_HOST=$VITE_SERVER_HOST
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
ARG VITE_SERVER_HOST
ENV VITE_SERVER_HOST=$VITE_SERVER_HOST
ENTRYPOINT [ "" ]
CMD ["node", "build"]