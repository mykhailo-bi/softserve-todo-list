using TodoList.Application.Abstractions.Persistence;
using TodoList.Application.TodoItems.Commands.CreateTodoItem;
using TodoList.Domain.Entities;

namespace TodoList.Application.Tests.TodoItems.Commands;

public class CreateTodoItemCommandHandlerTests
{
    [Fact]
    public async Task Handle_ShouldCreateItem_WhenTitleIsValid()
    {
        var repository = new InMemoryTodoItemRepository();
        var handler = new CreateTodoItemCommandHandler(repository);

        var result = await handler.Handle(
            new CreateTodoItemCommand("Implement backend scaffold", "Initial CQRS command", DateTimeOffset.UtcNow.AddDays(1)),
            CancellationToken.None);

        Assert.NotEqual(Guid.Empty, result);
        Assert.Single(repository.Items);
    }

    private sealed class InMemoryTodoItemRepository : ITodoItemRepository
    {
        public List<TodoItem> Items { get; } = new();

        public Task AddAsync(TodoItem item, CancellationToken cancellationToken)
        {
            Items.Add(item);
            return Task.CompletedTask;
        }

        public Task<int> SaveChangesAsync(CancellationToken cancellationToken)
        {
            return Task.FromResult(1);
        }
    }
}
