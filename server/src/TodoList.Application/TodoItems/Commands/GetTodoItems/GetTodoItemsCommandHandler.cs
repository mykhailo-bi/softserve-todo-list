using MediatR;
using TodoList.Application.Abstractions.Persistence;
using TodoList.Domain.Entities;

namespace TodoList.Application.TodoItems.Commands.GetTodoItems;

public sealed class GetTodoItemsCommandHandler : IRequestHandler<GetTodoItemsCommand, IEnumerable<TodoItem>>
{
    private readonly IRepository<TodoItem> _todoItemRepository;

    public GetTodoItemsCommandHandler(IRepository<TodoItem> todoItemRepository)
    {
        _todoItemRepository = todoItemRepository;
    }

    public async Task<IEnumerable<TodoItem>> Handle(GetTodoItemsCommand request, CancellationToken cancellationToken)
    {
        return await _todoItemRepository.GetAllAsync(cancellationToken);
    }
}
