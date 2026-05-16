using MediatR;
namespace TodoList.Application.TodoItems.Commands.UpdateTodoItem;

public record UpdateTodoItemCommand(Guid Id, string Title, string? Description, DateTimeOffset? DueDate) : IRequest;
