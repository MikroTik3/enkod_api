FROM node:22.19.0-alpine AS base

FROM base AS builder

WORKDIR /app

ENV NODE_ENV=development

COPY package.json package-lock.json ./

RUN npm ci

COPY . .

ENV POSTGRES_URI="postgresql://postgres:postgres@localhost:5433/enkod_api?schema=public"

RUN npx prisma generate
RUN npm run build

RUN npm prune --omit=dev


FROM node:22.19.0-alpine AS runner

WORKDIR /app

RUN apk add --no-cache libc6-compat openssl

ENV NODE_ENV=production

RUN chown -R node:node /app
USER node

COPY --chown=node:node --from=builder /app/package.json ./
COPY --chown=node:node --from=builder /app/package-lock.json ./
COPY --chown=node:node --from=builder /app/node_modules ./node_modules
COPY --chown=node:node --from=builder /app/dist ./dist
COPY --chown=node:node --from=builder /app/prisma.config.ts ./
COPY --chown=node:node --from=builder /app/prisma ./prisma

CMD ["node", "dist/main"]