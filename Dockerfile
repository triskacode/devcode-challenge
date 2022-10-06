#--- install dependencies & build application
FROM node:16.13.2-alpine3.15 AS builder

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY ./ ./
RUN npm run build && \
    npm prune --production

#--- running application

FROM node:16.13.2-alpine3.15 AS runner

ENV NODE_ENV production

WORKDIR /app

COPY --from=builder /app/package.json .
COPY --from=builder /app/node_modules/ ./node_modules/
COPY --from=builder /app/dist/ ./dist/

CMD [ "npm", "run", "start:prod" ]