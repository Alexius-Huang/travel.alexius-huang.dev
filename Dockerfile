FROM node:20-alpine AS builder
WORKDIR /app
RUN npm install -g corepack@latest
RUN corepack enable && corepack prepare pnpm@latest --activate
COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile
COPY . .
RUN pnpm run build

FROM node:20-alpine AS runner
WORKDIR /app
RUN npm install -g corepack@latest
RUN corepack enable && corepack prepare pnpm@latest --activate
COPY --from=builder /app/build ./build
COPY --from=builder /app/package.json ./
RUN pnpm install --prod

EXPOSE 3000

CMD ["pnpm", "start"]
