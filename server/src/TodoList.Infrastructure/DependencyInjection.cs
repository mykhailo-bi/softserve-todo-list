using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using TodoList.Application.Abstractions.Persistence;
using TodoList.Domain.Entities;
using TodoList.Infrastructure.Identity;
using TodoList.Infrastructure.Persistence;
using TodoList.Infrastructure.Persistence.Repositories;

namespace TodoList.Infrastructure;

public static class DependencyInjection
{
    public static IServiceCollection AddInfrastructure(this IServiceCollection services, IConfiguration configuration)
    {
        var connectionString = BuildConnectionStringFromDbVariables(configuration)
            ?? configuration.GetConnectionString("DefaultConnection")
            ?? throw new InvalidOperationException(
                "Database configuration was not found. Set either 'ConnectionStrings__DefaultConnection' or DB_HOST, DB_PORT, DB_NAME, DB_USER, DB_PASSWORD.");

        services.AddDbContext<ApplicationDbContext>(options =>
            options.UseSqlServer(connectionString));

        services.AddIdentityCore<AppUser>(options =>
            {
                options.Password.RequireDigit = true;
                options.Password.RequireUppercase = true;
            })
            .AddRoles<IdentityRole<Guid>>()
            .AddEntityFrameworkStores<ApplicationDbContext>();

        services.AddScoped<IRepository<TodoItem>, TodoItemRepository>();

        return services;
    }

    private static string? BuildConnectionStringFromDbVariables(IConfiguration configuration)
    {
        var host = configuration["DB_HOST"];
        var port = configuration["DB_PORT"];
        var database = configuration["DB_NAME"];
        var user = configuration["DB_USER"];
        var password = configuration["DB_PASSWORD"];

        if (string.IsNullOrWhiteSpace(host)
            || string.IsNullOrWhiteSpace(port)
            || string.IsNullOrWhiteSpace(database)
            || string.IsNullOrWhiteSpace(user)
            || string.IsNullOrWhiteSpace(password))
        {
            return null;
        }

        var trustServerCertificate = configuration["DB_TRUST_SERVER_CERTIFICATE"] ?? "true";
        var encrypt = configuration["DB_ENCRYPT"] ?? "false";

        return $"Server={host},{port};Database={database};User Id={user};Password={password};TrustServerCertificate={trustServerCertificate};Encrypt={encrypt}";
    }
}
