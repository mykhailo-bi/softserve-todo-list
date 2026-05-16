using TodoList.Application.Abstractions.Persistence;
using TodoList.Application.TodoItems.Commands.UpdateTodoItem;
using TodoList.Domain.Entities;

namespace TodoList.Application.Tests.TodoItems.Commands;

public class UpdateTodoItemCommandHandlerTests
{
    [Fact]
    public async Task Handle_ShouldUpdateItem_WhenItemExists()
    {
        var repository = new InMemoryTodoItemRepository();
        var item = new TodoItem("Original", "Old description", DateTimeOffset.UtcNow.AddDays(1));
        repository.Items.Add(item);

        var handler = new UpdateTodoItemCommandHandler(repository);

        await handler.Handle(
            new UpdateTodoItemCommand(item.Id, "Updated title", "Updated description", DateTimeOffset.UtcNow.AddDays(2)),
            CancellationToken.None);

        Assert.Equal("Updated title", item.Title);
        Assert.Equal("Updated description", item.Description);
        Assert.Equal(1, repository.SaveChangesCalls);
    }

    private sealed class InMemoryTodoItemRepository : IRepository<TodoItem>
    {
        public List<TodoItem> Items { get; } = new();

        public int SaveChangesCalls { get; private set; }

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
            SaveChangesCalls++;
            return Task.FromResult(1);
        }
    }
}
