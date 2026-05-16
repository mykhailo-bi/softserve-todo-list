using MediatR;
using TodoList.Application.Abstractions.Persistence;
using TodoList.Domain.Entities;

namespace TodoList.Application.TodoItems.Commands.GetTodoItems;

public sealed class GetTodoItemsQueryHandler : IRequestHandler<GetTodoItemsQuery, IEnumerable<TodoItem>>
{
    private readonly IRepository<TodoItem> _todoItemRepository;

    public GetTodoItemsQueryHandler(IRepository<TodoItem> todoItemRepository)
    {
        _todoItemRepository = todoItemRepository;
    }

    public async Task<IEnumerable<TodoItem>> Handle(GetTodoItemsQuery request, CancellationToken cancellationToken)
    {
        return await _todoItemRepository.GetAllAsync(cancellationToken);
    }
}
