using Microsoft.EntityFrameworkCore;
using TodoList.Application.Abstractions.Persistence;
using TodoList.Domain.Entities;

namespace TodoList.Infrastructure.Persistence.Repositories;

public class TodoItemRepository : IRepository<TodoItem>
{
    private readonly ApplicationDbContext _dbContext;

    public TodoItemRepository(ApplicationDbContext dbContext)
    {
        _dbContext = dbContext;
    }

    public async Task<IEnumerable<TodoItem>> GetAllAsync(CancellationToken cancellationToken)
    {
        return await _dbContext.TodoItems
            .AsNoTracking()
            .ToListAsync(cancellationToken);
    }

    public Task<TodoItem?> GetByIdAsync(Guid id, CancellationToken cancellationToken)
    {
        return _dbContext.TodoItems
            .AsNoTracking()
            .Where(i => i.Id == id)
            .FirstOrDefaultAsync(cancellationToken);
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
