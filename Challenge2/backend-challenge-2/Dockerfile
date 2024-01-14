# Use the ASP.NET Core runtime image
FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS base
WORKDIR /app
EXPOSE 80

# Use the SDK image to build the project
FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /src
COPY ["backend-challenge-2.csproj", "./"]
RUN dotnet restore "backend-challenge-2.csproj"
COPY . .
WORKDIR "/src/."
RUN dotnet build "backend-challenge-2.csproj" -c Release -o /app/build

FROM build AS publish
RUN dotnet publish "backend-challenge-2.csproj" -c Release -o /app/publish

# Final stage/image
FROM base AS final
WORKDIR /app
COPY --from=publish /app/publish .
ENTRYPOINT ["dotnet", "backend-challenge-2.dll"]
