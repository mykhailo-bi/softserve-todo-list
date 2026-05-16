using Moq;
using TodoList.Application.Abstractions.Persistence;
using TodoList.Application.TodoItems.Commands.CreateTodoItem;
using TodoList.Domain.Entities;

namespace TodoList.Application.Tests.TodoItems.Commands;

public class CreateTodoItemCommandHandlerTests
{
    [Fact]
    public async Task Handle_ShouldCreateItem_WhenTitleIsValid()
    {
        var repository = new Mock<IRepository<TodoItem>>();
        var handler = new CreateTodoItemCommandHandler(repository.Object);

        var result = await handler.Handle(
            new CreateTodoItemCommand("Implement backend scaffold", "Initial CQRS command", DateTimeOffset.UtcNow.AddDays(1)),
            CancellationToken.None);

        Assert.NotEqual(Guid.Empty, result);
        repository.Verify(x => x.AddAsync(It.IsAny<TodoItem>(), It.IsAny<CancellationToken>()), Times.Once);
        repository.Verify(x => x.SaveChangesAsync(It.IsAny<CancellationToken>()), Times.Once);
    }
}
