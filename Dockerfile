FROM node:20-alpine as build-stage
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

FROM nginx:stable-alpine as production-stage
COPY --from=build-stage /app/dist /usr/share/nginx/html
COPY deployment/nginx.conf /etc/nginx/conf.d/default.conf
COPY deployment/create_config.py create_config.py

ENV PYTHONUNBUFFERED=1
RUN apk add --update --no-cache python3 && ln -sf python3 /usr/bin/python

EXPOSE 80
CMD ["/bin/sh", "-c", "python3 create_config.py /usr/share/nginx/html/config.js && nginx -g 'daemon off;'"]
