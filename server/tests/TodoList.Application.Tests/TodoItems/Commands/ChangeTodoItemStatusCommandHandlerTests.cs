using Moq;
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
        var item = new TodoItem("Title", null, null);
        var repository = new Mock<IRepository<TodoItem>>();
        repository.Setup(x => x.GetByIdAsync(item.Id, It.IsAny<CancellationToken>())).ReturnsAsync(item);

        var handler = new ChangeTodoItemStatusCommandHandler(repository.Object);

        await handler.Handle(
            new ChangeTodoItemStatusCommand(item.Id, TodoItemStatus.Done),
            CancellationToken.None);

        Assert.Equal(TodoItemStatus.Done, item.Status);
        repository.Verify(x => x.SaveChangesAsync(It.IsAny<CancellationToken>()), Times.Once);
    }
}
