FROM node:20-slim AS base
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable

FROM base AS build
COPY . /usr/src/app
WORKDIR /usr/src/app
RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install --frozen-lockfile
RUN pnpm run -r build

RUN pnpm deploy --filter=api-server --prod /prod/api-server
RUN pnpm deploy --filter=cloud --prod /prod/cloud
RUN pnpm deploy --filter=sing --prod /prod/sing
RUN pnpm deploy --filter=tool --prod /prod/tool
RUN pnpm deploy --filter=website --prod /prod/website

FROM base AS looney-api-server
COPY --from=build /prod/api-server /prod/api-server
WORKDIR /prod/api-server
RUN npm install pm2 -g
EXPOSE 5555
CMD [ "pm2-runtime", "dist/index.js" ]

FROM base AS looney-cloud
COPY --from=build /prod/cloud /prod/cloud
WORKDIR /prod/cloud
EXPOSE 3000
CMD [ "pnpm", "start" ]

FROM base AS looney-sing
COPY --from=build /prod/sing /prod/sing
WORKDIR /prod/sing
EXPOSE 3001
CMD [ "pnpm", "start" ]

FROM base AS looney-tool
COPY --from=build /prod/tool /prod/tool
WORKDIR /prod/tool
EXPOSE 3002
CMD [ "pnpm", "start" ]

FROM base AS looney-website
COPY --from=build /prod/website /prod/website
WORKDIR /prod/website
EXPOSE 3003
CMD [ "pnpm", "start" ]