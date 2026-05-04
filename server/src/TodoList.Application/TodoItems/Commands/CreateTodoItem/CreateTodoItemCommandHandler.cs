using MediatR;
using TodoList.Application.Abstractions.Persistence;
using TodoList.Domain.Entities;

namespace TodoList.Application.TodoItems.Commands.CreateTodoItem;

public sealed class CreateTodoItemCommandHandler : IRequestHandler<CreateTodoItemCommand, Guid>
{
    private readonly IRepository<TodoItem> _todoItemRepository;

    public CreateTodoItemCommandHandler(IRepository<TodoItem> todoItemRepository)
    {
        _todoItemRepository = todoItemRepository;
    }

    public async Task<Guid> Handle(CreateTodoItemCommand request, CancellationToken cancellationToken)
    {
        var title = request.Title.Trim();

        if (string.IsNullOrWhiteSpace(title))
        {
            throw new ArgumentException("Title is required.", nameof(request.Title));
        }

        var item = new TodoItem(title, request.Description?.Trim(), request.DueDate);

        await _todoItemRepository.AddAsync(item, cancellationToken);
        await _todoItemRepository.SaveChangesAsync(cancellationToken);

        return item.Id;
    }
}
