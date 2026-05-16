using Moq;
using TodoList.Application.Abstractions.Persistence;
using TodoList.Application.TodoItems.Commands.DeleteTodoItem;
using TodoList.Domain.Entities;

namespace TodoList.Application.Tests.TodoItems.Commands;

public class DeleteTodoItemCommandHandlerTests
{
    [Fact]
    public async Task Handle_ShouldRemoveItem_WhenItemExists()
    {
        var item = new TodoItem("Title", null, null);
        var repository = new Mock<IRepository<TodoItem>>();
        repository.Setup(x => x.GetByIdAsync(item.Id, It.IsAny<CancellationToken>())).ReturnsAsync(item);

        var handler = new DeleteTodoItemCommandHandler(repository.Object);

        await handler.Handle(new DeleteTodoItemCommand(item.Id), CancellationToken.None);

        repository.Verify(x => x.RemoveAsync(item, It.IsAny<CancellationToken>()), Times.Once);
        repository.Verify(x => x.SaveChangesAsync(It.IsAny<CancellationToken>()), Times.Once);
    }
}
