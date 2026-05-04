using TodoList.Domain.Entities;

namespace TodoList.Application.Abstractions.Persistence;

public interface ITodoItemRepository
{
    Task AddAsync(TodoItem item, CancellationToken cancellationToken);

    Task<int> SaveChangesAsync(CancellationToken cancellationToken);
}
