using MediatR;
using TodoList.Application.Abstractions.Persistence;
using TodoList.Domain.Entities;

namespace TodoList.Application.TodoItems.Commands.DeleteTodoItem;

public sealed class DeleteTodoItemCommandHandler : IRequestHandler<DeleteTodoItemCommand>
{
    private readonly IRepository<TodoItem> _todoItemRepository;

    public DeleteTodoItemCommandHandler(IRepository<TodoItem> todoItemRepository)
    {
        _todoItemRepository = todoItemRepository;
    }

    public async Task Handle(DeleteTodoItemCommand request, CancellationToken cancellationToken)
    {
        var item = await _todoItemRepository.GetByIdAsync(request.Id, cancellationToken);

        if (item is null)
        {
            throw new KeyNotFoundException($"Todo item with id {request.Id} not found.");
        }

        await _todoItemRepository.RemoveAsync(item, cancellationToken);
        await _todoItemRepository.SaveChangesAsync(cancellationToken);
    }
}
