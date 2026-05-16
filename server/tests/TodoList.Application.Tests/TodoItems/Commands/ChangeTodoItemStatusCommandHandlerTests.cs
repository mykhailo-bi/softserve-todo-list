using TodoList.Application.Abstractions.Persistence;
using TodoList.Application.TodoItems.Commands.ChangeTodoItemStatus;
using TodoList.Domain.Entities;
using TodoList.Domain.Enums;

namespace TodoList.Application.Tests.TodoItems.Commands;

public class ChangeTodoItemStatusCommandHandlerTests
{
    [Fact]
    public async Task Handle_ShouldUpdateStatus_WhenItemExists()
    {
        var repository = new InMemoryTodoItemRepository();
        var item = new TodoItem("Title", null, null);
        repository.Items.Add(item);

        var handler = new ChangeTodoItemStatusCommandHandler(repository);

        await handler.Handle(
            new ChangeTodoItemStatusCommand(item.Id, TodoItemStatus.Done),
            CancellationToken.None);

        Assert.Equal(TodoItemStatus.Done, item.Status);
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
