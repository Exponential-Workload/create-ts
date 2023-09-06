FROM node:20 as builder
WORKDIR /app
COPY package.json pnpm-lock.yaml ./
RUN npm install -g pnpm
RUN pnpm install
COPY . .
RUN pnpm build

FROM node:20 as runner
WORKDIR /app
COPY pnpm-lock.yaml package.json ./
COPY --from=builder /app/build ./build
COPY --from=builder /app/.svelte-kit ./.svelte-kit
RUN npm install -g pnpm
RUN pnpm install --prod

EXPOSE 3000
ENV NODE_ENV=production
CMD ["pnpm","start"]
