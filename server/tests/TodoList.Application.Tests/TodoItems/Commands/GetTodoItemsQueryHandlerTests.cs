using Moq;
using TodoList.Application.Abstractions.Persistence;
using TodoList.Application.TodoItems.Commands.GetTodoItems;
using TodoList.Domain.Entities;
using TodoList.Domain.Enums;

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

    [Fact]
    public async Task Handle_ShouldFilterByStatus_WhenStatusProvided()
    {
        var items = new[]
        {
            new TodoItem("First", null, null),
            new TodoItem("Second", null, null),
        };

        items[1].SetStatus(TodoItemStatus.Done);

        var repository = new Mock<IRepository<TodoItem>>();
        repository.Setup(x => x.GetAllAsync(It.IsAny<CancellationToken>())).ReturnsAsync(items);

        var handler = new GetTodoItemsQueryHandler(repository.Object);

        var result = await handler.Handle(new GetTodoItemsQuery(Status: TodoItemStatus.Done), CancellationToken.None);

        Assert.Single(result);
        Assert.Equal(TodoItemStatus.Done, result.First().Status);
    }

    [Fact]
    public async Task Handle_ShouldFilterBySearchTerm_WhenSearchTermProvided()
    {
        var items = new[]
        {
            new TodoItem("Buy groceries", null, null),
            new TodoItem("Buy milk", null, null),
            new TodoItem("Walk the dog", null, null),
        };

        var repository = new Mock<IRepository<TodoItem>>();
        repository.Setup(x => x.GetAllAsync(It.IsAny<CancellationToken>())).ReturnsAsync(items);

        var handler = new GetTodoItemsQueryHandler(repository.Object);

        var result = await handler.Handle(new GetTodoItemsQuery(SearchTerm: "buy"), CancellationToken.None);

        Assert.Equal(2, result.Count());
        Assert.All(result, item => Assert.Contains("Buy", item.Title));
    }

    [Fact]
    public async Task Handle_ShouldReturnAllItems_WhenSearchTermIsEmpty()
    {
        var items = new[]
        {
            new TodoItem("First", null, null),
            new TodoItem("Second", null, null),
        };

        var repository = new Mock<IRepository<TodoItem>>();
        repository.Setup(x => x.GetAllAsync(It.IsAny<CancellationToken>())).ReturnsAsync(items);

        var handler = new GetTodoItemsQueryHandler(repository.Object);

        var result = await handler.Handle(new GetTodoItemsQuery(SearchTerm: ""), CancellationToken.None);

        Assert.Equal(2, result.Count());
    }

    [Fact]
    public async Task Handle_ShouldReturnAllItems_WhenSearchTermIsNull()
    {
        var items = new[]
        {
            new TodoItem("First", null, null),
            new TodoItem("Second", null, null),
        };

        var repository = new Mock<IRepository<TodoItem>>();
        repository.Setup(x => x.GetAllAsync(It.IsAny<CancellationToken>())).ReturnsAsync(items);

        var handler = new GetTodoItemsQueryHandler(repository.Object);

        var result = await handler.Handle(new GetTodoItemsQuery(), CancellationToken.None);

        Assert.Equal(2, result.Count());
    }

    [Fact]
    public async Task Handle_ShouldApplyStatusAndSearchTermTogether()
    {
        var items = new[]
        {
            new TodoItem("Buy groceries", null, null),
            new TodoItem("Buy milk", null, null),
            new TodoItem("Walk the dog", null, null),
        };

        items[0].SetStatus(TodoItemStatus.Done);

        var repository = new Mock<IRepository<TodoItem>>();
        repository.Setup(x => x.GetAllAsync(It.IsAny<CancellationToken>())).ReturnsAsync(items);

        var handler = new GetTodoItemsQueryHandler(repository.Object);

        var result = await handler.Handle(
            new GetTodoItemsQuery(Status: TodoItemStatus.Done, SearchTerm: "buy"),
            CancellationToken.None);

        Assert.Single(result);
        Assert.Equal("Buy groceries", result.First().Title);
    }
}
