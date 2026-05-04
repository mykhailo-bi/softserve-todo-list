# To-Do List App

## Getting Started

### Server

Prerequisites:
- .NET SDK 9.0+
- SQL Server running on `localhost:1433` (or update `server/src/TodoList.API/appsettings.Development.json`)

Run the API:

```bash
cd server
dotnet restore
dotnet build
dotnet run --project src/TodoList.API
```

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
