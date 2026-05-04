# To-Do List App

## Getting Started

### Environment variables

Copy `.env.example` to `.env` and edit with your values.

- Server database variables in `.env`:
  - `DB_HOST`, `DB_PORT`, `DB_NAME`, `DB_USER`, `DB_PASSWORD`
  - Optional: `DB_TRUST_SERVER_CERTIFICATE` (default `true`), `DB_ENCRYPT` (default `false`)
- Client variable in `.env`:
  - `NG_APP_API_BASE_URL`
- The server reads `.env` automatically on startup.
- The client scripts load `../.env` before running Angular/Jest.

### Server

Prerequisites:
- .NET SDK 9.0+
- SQL Server running on `localhost:1433` (or update `server/src/TodoList.API/appsettings.Development.json`)

First, restore, build the solution and perform DB migrations:

```bash
cd server
dotnet restore
dotnet build
dotnet ef database update --project src/TodoList.Infrastructure --startup-project src/TodoList.API
```

Then run the API:
```bash
dotnet run --project src/TodoList.API
```

If `dotnet ef` is not installed locally, install it first with `dotnet tool install --global dotnet-ef`.

The API starts with OpenAPI in development mode.

### Client

Prerequisites:
- Bun 1.0+

Install and run with Bun:

```bash
cd client
bun install
bun run start
```

The client runs at `http://localhost:4200/`.

## Functional Requirements

- Create tasks
- Edit tasks
- Delete tasks as needed
- Change task status (Todo, In Progress, Done)
- Add a calendar component to set task deadlines

## Technology Stack

- HTML, CSS, TypeScript  
- **Angular** (*React*), **NgRx (Store/Effects)** (*Redux (Redux Toolkit)*)  
- AntDesign/**Angular Material** (*MUI*) (optional)  
- Jest  
- .NET 9.0 (Backend)  
- ASP.NET Identity
- EF Core  
- MediatR + CQRS  
- N-layer architecture  
- XUnit tests + coverage  
- Mapper (optional)  
- Serilog (optional)  
- Docker local setup (optional)  
- MSSQL database  
- (Optional) Integrate OpenTelemetry (frontend & backend), export traces and metrics to an OTLP exporter (e.g., SigNoz) to enable complete end-to-end tracing and logging
