using Moq;
using TodoList.Application.Abstractions.Persistence;
using TodoList.Application.TodoItems.Commands.UpdateTodoItem;
using TodoList.Domain.Entities;

namespace TodoList.Application.Tests.TodoItems.Commands;

public class UpdateTodoItemCommandHandlerTests
{
    [Fact]
    public async Task Handle_ShouldUpdateItem_WhenItemExists()
    {
        var item = new TodoItem("Original", "Old description", DateTimeOffset.UtcNow.AddDays(1));
        var repository = new Mock<IRepository<TodoItem>>();
        repository.Setup(x => x.GetByIdAsync(item.Id, It.IsAny<CancellationToken>())).ReturnsAsync(item);

        var handler = new UpdateTodoItemCommandHandler(repository.Object);

        await handler.Handle(
            new UpdateTodoItemCommand(item.Id, "Updated title", "Updated description", DateTimeOffset.UtcNow.AddDays(2)),
            CancellationToken.None);

        Assert.Equal("Updated title", item.Title);
        Assert.Equal("Updated description", item.Description);
        repository.Verify(x => x.SaveChangesAsync(It.IsAny<CancellationToken>()), Times.Once);
    }
}
