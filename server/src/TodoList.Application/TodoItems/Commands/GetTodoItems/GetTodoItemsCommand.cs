using MediatR;
using TodoList.Domain.Entities;

namespace TodoList.Application.TodoItems.Commands.GetTodoItems;

public sealed record GetTodoItemsCommand() : IRequest<IEnumerable<TodoItem>>;
