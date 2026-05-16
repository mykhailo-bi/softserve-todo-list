using Moq;
using TodoList.Application.Abstractions.Persistence;
using TodoList.Application.TodoItems.Commands.GetTodoItems;
using TodoList.Domain.Entities;

namespace TodoList.Application.Tests.TodoItems.Commands;

public class GetTodoItemsQueryHandlerTests
{
    [Fact]
    public async Task Handle_ShouldReturnAllItems_WhenItemsExist()
    {
        var items = new[]
        {
            new TodoItem("First", null, null),
            new TodoItem("Second", "Description", DateTimeOffset.UtcNow.AddDays(1))
        };

        var repository = new Mock<IRepository<TodoItem>>();
        repository.Setup(x => x.GetAllAsync(It.IsAny<CancellationToken>())).ReturnsAsync(items);

        var handler = new GetTodoItemsQueryHandler(repository.Object);

        var result = await handler.Handle(new GetTodoItemsQuery(), CancellationToken.None);

        Assert.Equal(2, result.Count());

        repository.Verify(x => x.GetAllAsync(It.IsAny<CancellationToken>()), Times.Once);
    }
}
