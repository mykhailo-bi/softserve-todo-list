using MediatR;
using TodoList.Application.Abstractions.Persistence;
using TodoList.Domain.Entities;

namespace TodoList.Application.TodoItems.Commands.ChangeTodoItemStatus;

public sealed class ChangeTodoItemStatusCommandHandler : IRequestHandler<ChangeTodoItemStatusCommand>
{
    private readonly IRepository<TodoItem> _todoItemRepository;

    public ChangeTodoItemStatusCommandHandler(IRepository<TodoItem> todoItemRepository)
    {
        _todoItemRepository = todoItemRepository;
    }

    public async Task Handle(ChangeTodoItemStatusCommand request, CancellationToken cancellationToken)
    {
        var item = await _todoItemRepository.GetByIdAsync(request.Id, cancellationToken);
        
        if (item is null)
        {
            throw new KeyNotFoundException($"Todo item with id {request.Id} not found.");
        }

        item.SetStatus(request.Status);

        await _todoItemRepository.SaveChangesAsync(cancellationToken);
    }
}