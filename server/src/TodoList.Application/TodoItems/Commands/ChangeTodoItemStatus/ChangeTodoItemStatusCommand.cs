using MediatR;
using TodoList.Domain.Enums;

namespace TodoList.Application.TodoItems.Commands.ChangeTodoItemStatus;

public record ChangeTodoItemStatusCommand(Guid Id, TodoItemStatus Status) : IRequest;
