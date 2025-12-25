# Bourbon Buddy

A social and review platform for whiskey and broader spirits enthusiasts. This repository will host the backend API (ASP.NET Core + PostgreSQL) and, later, a React Native mobile client.

## Current status (MVP bootstrap)
- Domain entities defined for core objects such as users, bottles, reviews, and cellar items.
- ASP.NET Core Web API with Swagger, PostgreSQL configuration, and healthcheck endpoint.
- Bottle catalog endpoints for searching, reading, and creating bottles.
- Review endpoints for creating and listing reviews (with tasting tags and image URLs).
- User endpoints for registration, profiles, and follow/unfollow.
- Cellar endpoints to add or update a user's inventory.
- Discover endpoint for trending and top-rated bottle rankings.

## Running the API locally
The development environment in this workspace does not ship with the .NET SDK. Install the .NET 8 SDK locally, then from the `backend` directory run:

```bash
dotnet restore
cd BourbonBuddy.Api
dotnet run
```

The API will listen on the default ASP.NET Core ports and expose Swagger UI in development. The default PostgreSQL connection string can be configured via `appsettings.json` or environment variables.

## Planned architecture
- **Frontend:** React Native (Expo) + TypeScript.
- **Backend:** ASP.NET Core 8 Web API with Entity Framework Core and PostgreSQL.
- **Storage:** Amazon S3 (or compatible) for media assets.
- **Caching/Queues:** Redis for caching feeds and rankings as they are built out.

Future work will expand the API surface area (authentication, reviews, discovery, cellar management) and introduce CI/CD and infrastructure definitions aligned with AWS.
