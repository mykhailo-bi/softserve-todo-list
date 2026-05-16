using TodoList.Application.Abstractions.Persistence;
using TodoList.Application.TodoItems.Commands.GetTodoItems;
using TodoList.Domain.Entities;

namespace TodoList.Application.Tests.TodoItems.Commands;

public class GetTodoItemsQueryHandlerTests
{
    [Fact]
    public async Task Handle_ShouldReturnAllItems_WhenItemsExist()
    {
        var repository = new InMemoryTodoItemRepository();
        repository.Items.Add(new TodoItem("First", null, null));
        repository.Items.Add(new TodoItem("Second", "Description", DateTimeOffset.UtcNow.AddDays(1)));

        var handler = new GetTodoItemsQueryHandler(repository);

        var result = await handler.Handle(new GetTodoItemsQuery(), CancellationToken.None);

        Assert.Equal(2, result.Count());
    }

    private sealed class InMemoryTodoItemRepository : IRepository<TodoItem>
    {
        public List<TodoItem> Items { get; } = new();

        public Task<IEnumerable<TodoItem>> GetAllAsync(CancellationToken cancellationToken)
        {
            return Task.FromResult(Items.AsEnumerable());
        }

        public Task<TodoItem?> GetByIdAsync(Guid id, CancellationToken cancellationToken)
        {
            return Task.FromResult(Items.FirstOrDefault(i => i.Id == id));
        }

        public Task AddAsync(TodoItem item, CancellationToken cancellationToken)
        {
            Items.Add(item);
            return Task.CompletedTask;
        }

        public Task RemoveAsync(TodoItem item, CancellationToken cancellationToken)
        {
            Items.Remove(item);
            return Task.CompletedTask;
        }

        public Task<int> SaveChangesAsync(CancellationToken cancellationToken)
        {
            return Task.FromResult(1);
        }
    }
}
