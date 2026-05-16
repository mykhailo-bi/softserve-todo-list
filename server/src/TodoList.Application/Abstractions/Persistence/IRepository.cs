using TodoList.Domain.Entities;

namespace TodoList.Application.Abstractions.Persistence;

public interface IRepository<TEntity>
{
    Task<IEnumerable<TEntity>> GetAllAsync(CancellationToken cancellationToken);

    Task<TEntity?> GetByIdAsync(Guid id, CancellationToken cancellationToken);

    Task AddAsync(TEntity item, CancellationToken cancellationToken);

    Task RemoveAsync(TEntity item, CancellationToken cancellationToken);

    Task<int> SaveChangesAsync(CancellationToken cancellationToken);
}
