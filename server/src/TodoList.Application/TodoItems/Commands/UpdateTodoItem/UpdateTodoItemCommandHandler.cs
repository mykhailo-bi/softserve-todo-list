using MediatR;
using TodoList.Application.Abstractions.Persistence;
using TodoList.Domain.Entities;

namespace TodoList.Application.TodoItems.Commands.UpdateTodoItem;

public sealed class UpdateTodoItemCommandHandler : IRequestHandler<UpdateTodoItemCommand>
{
    private readonly IRepository<TodoItem> _todoItemRepository;

    public UpdateTodoItemCommandHandler(IRepository<TodoItem> todoItemRepository)
    {
        _todoItemRepository = todoItemRepository;
    }

    public async Task Handle(UpdateTodoItemCommand request, CancellationToken cancellationToken)
    {
        var item = await _todoItemRepository.GetByIdAsync(request.Id, cancellationToken);
        
        if (item is null)
        {
            throw new KeyNotFoundException($"Todo item with id {request.Id} not found.");
        }

        item.Update(request.Title.Trim(), request.Description?.Trim(), request.DueDate);

        await _todoItemRepository.SaveChangesAsync(cancellationToken);
    }
}