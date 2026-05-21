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
        var items = await _todoItemRepository.GetAllAsync(cancellationToken);
        if (request.Status.HasValue)
        {
            items = items.Where(i => i.Status == request.Status.Value);
        }
        if (!string.IsNullOrWhiteSpace(request.SearchTerm))
        {
            items = items.Where(i => i.Title.Contains(request.SearchTerm, StringComparison.OrdinalIgnoreCase));
        }
        return items;
    }
}
