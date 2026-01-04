FROM node:18-alpine AS builder
WORKDIR /app
COPY . .
RUN npm ci
RUN npx turbo run build --filter=admin-panel...

FROM nginx:alpine
COPY --from=builder /app/apps/admin-panel/dist /usr/share/nginx/html
COPY apps/admin-panel/nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
