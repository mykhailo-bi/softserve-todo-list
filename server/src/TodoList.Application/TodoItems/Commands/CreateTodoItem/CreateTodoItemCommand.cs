using MediatR;

namespace TodoList.Application.TodoItems.Commands.CreateTodoItem;

public sealed record CreateTodoItemCommand(string Title, string? Description, DateTimeOffset? DueDate) : IRequest<Guid>;
