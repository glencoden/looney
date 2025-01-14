FROM node:18-alpine AS base
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable

FROM base AS builder
WORKDIR /app

RUN pnpm add -g turbo

COPY . .
RUN turbo prune api-server --docker

FROM base AS installer
WORKDIR /app

# First install dependencies (as they change less often)
COPY --from=builder /app/out/json/ .
RUN pnpm install

# Build the project and its dependencies
COPY --from=builder /app/out/full/ .
RUN pnpm turbo build --filter=api-server...

FROM base AS runner
WORKDIR /app

# Install pm2 globally before switching user
RUN pnpm add -g pm2

# Don't run production as root
RUN addgroup --system --gid 1001 expressjs
RUN adduser --system --uid 1001 expressjs
USER expressjs

COPY --from=installer /app .

EXPOSE 5400

CMD [ "pm2-runtime", "apps/api-server/dist/index.js" ]