using Microsoft.EntityFrameworkCore;
using TodoList.Application.Abstractions.Persistence;
using TodoList.Domain.Entities;

namespace TodoList.Infrastructure.Persistence.Repositories;

public class TodoItemRepository : ITodoItemRepository
{
    private readonly ApplicationDbContext _dbContext;

    public TodoItemRepository(ApplicationDbContext dbContext)
    {
        _dbContext = dbContext;
    }

    public Task AddAsync(TodoItem item, CancellationToken cancellationToken)
    {
        return _dbContext.TodoItems.AddAsync(item, cancellationToken).AsTask();
    }

    public Task<int> SaveChangesAsync(CancellationToken cancellationToken)
    {
        return _dbContext.SaveChangesAsync(cancellationToken);
    }
}
