FROM node:22 AS build
WORKDIR /app
COPY client/package*.json ./
RUN npm install
COPY client/ . .
RUN npm run build -- --configuration production

FROM nginx:alpine AS runtime
COPY client/nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/dist/todo-list-client/browser /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
