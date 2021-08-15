# build prepare
FROM java:alpine as prepare-stage
WORKDIR /codegen/
RUN apk update && \
  apk add --update nodejs
COPY . .
RUN node ./openapi/before-fix.js
RUN java -jar ./openapi/openapi-generator-cli.jar generate -g typescript-angular -o ./src/app/api_client -c ./openapi/swagger-codegen-cli.cfg.json -t ./openapi/templates -i ./docs/backend.json --skip-validate-spec
RUN node ./openapi/after-fix.js
# build stage
FROM node:lts-alpine as build-stage
WORKDIR /app/
# Copy generated API Library to Building Stage
COPY --from=prepare-stage /codegen .
COPY package*.json ./

# Install latest Angular CLI
RUN npm install @angular/cli -g
RUN npm install
# Build for Produktion
RUN npm run build:prod

# production stage
FROM nginx:stable-alpine as production-stage
# Removing nginx default page.
RUN rm -rf /usr/share/nginx/html/*
# Copying nginx configuration.
COPY docker/config/nginx.azure.conf /etc/nginx/conf.d/default.conf
# Copy dist folder into nginx web root
COPY --from=build-stage /app/dist/beekeeper-frontend /usr/share/nginx/html
EXPOSE 80 443
CMD ["nginx", "-g", "daemon off;"]
