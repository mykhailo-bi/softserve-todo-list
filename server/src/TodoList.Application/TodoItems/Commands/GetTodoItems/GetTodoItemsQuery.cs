using MediatR;
using TodoList.Domain.Entities;
using TodoList.Domain.Enums;

namespace TodoList.Application.TodoItems.Commands.GetTodoItems;

public sealed record GetTodoItemsQuery(TodoItemStatus? Status = null) : IRequest<IEnumerable<TodoItem>>;
