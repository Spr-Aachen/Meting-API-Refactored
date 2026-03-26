FROM node:18-alpine

ARG UID=1010
ARG GID=1010

RUN apk add --no-cache dumb-init

WORKDIR /app

COPY package*.json ./
RUN npm install --production

COPY . .

RUN mkdir -p /app/dist && \
    node esbuild.config.js

RUN addgroup -g ${GID} -S appgroup && \
    adduser -u ${UID} -S appuser -G appgroup

USER appuser

EXPOSE 3000

ENTRYPOINT ["dumb-init", "--"]

CMD ["node", "dist/node.js"]