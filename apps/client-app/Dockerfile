FROM node:18-alpine AS builder
WORKDIR /app
COPY . .
RUN npm ci
RUN npx turbo run build --filter=client-app...

FROM node:18-alpine AS runner
WORKDIR /app
ENV NODE_ENV production

# Next.js standalone output
COPY --from=builder /app/apps/client-app/.next/standalone ./
COPY --from=builder /app/apps/client-app/.next/static ./apps/client-app/.next/static
COPY --from=builder /app/apps/client-app/public ./apps/client-app/public

EXPOSE 3000
CMD ["node", "apps/client-app/server.js"]
