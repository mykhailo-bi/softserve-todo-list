using TodoList.Application.Abstractions.Persistence;
using TodoList.Application.TodoItems.Commands.DeleteTodoItem;
using TodoList.Domain.Entities;

namespace TodoList.Application.Tests.TodoItems.Commands;

public class DeleteTodoItemCommandHandlerTests
{
    [Fact]
    public async Task Handle_ShouldRemoveItem_WhenItemExists()
    {
        var repository = new InMemoryTodoItemRepository();
        var item = new TodoItem("Title", null, null);
        repository.Items.Add(item);

        var handler = new DeleteTodoItemCommandHandler(repository);

        await handler.Handle(new DeleteTodoItemCommand(item.Id), CancellationToken.None);

        Assert.Empty(repository.Items);
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
