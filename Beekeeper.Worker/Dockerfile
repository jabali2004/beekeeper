FROM mcr.microsoft.com/dotnet/runtime:5.0 AS base
WORKDIR /app

FROM mcr.microsoft.com/dotnet/sdk:5.0 AS build
WORKDIR /src
COPY ["Beekeeper.Worker/Beekeeper.Worker.csproj", "Beekeeper.Worker/"]
RUN dotnet restore "Beekeeper.Worker/Beekeeper.Worker.csproj"
COPY . .
WORKDIR "/src/Beekeeper.Worker"
RUN dotnet build "Beekeeper.Worker.csproj" -c Release -o /app/build

FROM build AS publish
RUN dotnet publish "Beekeeper.Worker.csproj" -c Release -o /app/publish

FROM base AS final
WORKDIR /app
COPY --from=publish /app/publish .
ENTRYPOINT ["dotnet", "Beekeeper.Worker.dll"]
