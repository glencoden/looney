FROM node:18-alpine AS base
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable

ARG VITE_API_URL
ENV VITE_API_URL=$VITE_API_URL

FROM base AS builder
WORKDIR /app

RUN pnpm add -g turbo

COPY . .
RUN turbo prune website --docker

FROM base AS installer
WORKDIR /app

# First install dependencies (as they change less often)
COPY --from=builder /app/out/json/ .
RUN pnpm install

# Build the project and its dependencies
COPY --from=builder /app/out/full/ .
RUN pnpm turbo build --filter=website...

FROM base AS runner
WORKDIR /app

# Don't run production as root
RUN addgroup --system --gid 1001 expressjs
RUN adduser --system --uid 1001 expressjs
USER expressjs

COPY --from=installer /app .

WORKDIR /app/apps/website

EXPOSE 3003

CMD [ "pnpm", "start" ]