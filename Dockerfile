# syntax=docker/dockerfile:1

# 固定次要版本，避免 latest 漂移；需完全可复现可精确到 22.x.y-alpine
FROM node:22-alpine

ENV NODE_ENV=production

WORKDIR /app

# 先只拷贝依赖清单，最大化利用层缓存
COPY package.json package-lock.json ./
RUN --mount=type=cache,target=/root/.npm \
    npm ci --omit=dev --no-audit --no-fund

# 再拷贝源码（.dockerignore 已排除 .git/.env/node_modules 等）
COPY --chown=node:node . .

USER node

EXPOSE 3000

HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
    CMD ["node", "-e", "fetch('http://127.0.0.1:' + (process.env.PORT || 3000) + '/test').then(r => process.exit(r.ok ? 0 : 1)).catch(() => process.exit(1))"]

CMD ["node", "node.js"]