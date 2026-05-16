using MediatR;
using TodoList.Domain.Entities;

namespace TodoList.Application.TodoItems.Commands.GetTodoItems;

public sealed record GetTodoItemsQuery() : IRequest<IEnumerable<TodoItem>>;
