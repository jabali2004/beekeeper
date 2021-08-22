# build prepare
FROM java:alpine as frontend-prepare-stage
WORKDIR /codegen/
RUN apk update && \
  apk add --update nodejs

COPY ./Beekeeper.Frontend .
RUN java -jar ./openapi/openapi-generator-cli.jar generate -g typescript-angular -o ./src/app/api_client -c ./openapi/swagger-codegen-cli.cfg.json -t ./openapi/templates -i ./docs/backend.json --skip-validate-spec

# build stage
FROM node:lts-alpine as frontend-build-stage
WORKDIR /app/
# Copy generated API Library to Building Stage
COPY --from=frontend-prepare-stage /codegen .
COPY Beekeeper.Frontend/package*.json ./

# Install latest Angular CLI
RUN npm install @angular/cli -g
RUN npm install
# Build for Produktion
RUN npm run build:prod

#See https://aka.ms/containerfastmode to understand how Visual Studio uses this Dockerfile to build your images for faster debugging.

FROM mcr.microsoft.com/dotnet/aspnet:5.0 AS base
EXPOSE 80
EXPOSE 443
WORKDIR /app

FROM mcr.microsoft.com/dotnet/sdk:5.0 AS backend-build-stage
WORKDIR /src
COPY ["Beekeeper.Backend/BeekeeperBackend.csproj", "Beekeeper.Backend/"]
RUN dotnet restore "Beekeeper.Backend/BeekeeperBackend.csproj"

COPY . .
WORKDIR "/src/Beekeeper.Backend"
RUN dotnet build "BeekeeperBackend.csproj" -c Release -o /app/build

FROM backend-build-stage AS backend-publish-stage
RUN dotnet publish "BeekeeperBackend.csproj" -c Release -o /app/publish

FROM base AS final
WORKDIR /app

COPY --from=frontend-build-stage /app/dist/beekeeper-frontend /app/frontend
COPY --from=backend-publish-stage /app/publish .

ENTRYPOINT ["dotnet", "BeekeeperBackend.dll"]

