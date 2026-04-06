FROM oven/bun:1

WORKDIR /app

COPY ./packages ./packages
COPY ./bun.lock ./bun.lock

COPY ./package.json ./package.json
COPY ./turbo.json ./turbo.json

COPY ./apps/backend ./apps/backend

RUN bun install
RUN bun run db:migrate

EXPOSE 4000

CMD ["bun", "run", "start:backend"]



