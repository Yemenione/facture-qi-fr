FROM node:18-alpine

WORKDIR /app
COPY . .
RUN npm ci
RUN npx turbo run build --filter=api...

CMD ["node", "apps/api/dist/main"]
