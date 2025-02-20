FROM node:20-slim AS builder
WORKDIR /app
COPY package.json pnpm-lock.yaml ./
RUN npm install -g corepack@latest
RUN corepack enable && corepack prepare pnpm@latest --activate
RUN pnpm install --frozen-lockfile
COPY . .
RUN pnpm run build

FROM node:20-slim AS runner
WORKDIR /app
RUN npm install -g corepack@latest
RUN corepack enable && corepack prepare pnpm@latest --activate
COPY --from=builder /app/build ./build
COPY --from=builder /app/package.json ./
RUN pnpm install --prod

EXPOSE 3000

CMD ["pnpm", "start"]
