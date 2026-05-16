using MediatR;
using Microsoft.AspNetCore.Mvc;
using TodoList.Application.TodoItems.Commands.CreateTodoItem;
using TodoList.Application.TodoItems.Commands.ChangeTodoItemStatus;
using TodoList.Application.TodoItems.Commands.DeleteTodoItem;
using TodoList.Application.TodoItems.Commands.GetTodoItems;
using TodoList.Application.TodoItems.Commands.UpdateTodoItem;
using TodoList.Domain.Entities;
using TodoList.Domain.Enums;

namespace TodoList.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class TodoItemsController : ControllerBase
{
    private readonly ISender _sender;

    public TodoItemsController(ISender sender)
    {
        _sender = sender;
    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<TodoItem>>> GetAll(GetTodoItemsQuery query, CancellationToken cancellationToken)
    {
        var items = await _sender.Send(query, cancellationToken);
        return Ok(items);
    }

    [HttpPost]
    public async Task<ActionResult<Guid>> Create(CreateTodoItemCommand command, CancellationToken cancellationToken)
    {
        var id = await _sender.Send(command, cancellationToken);
        return CreatedAtAction(nameof(Create), new { id }, id);
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> Update(Guid id, UpdateTodoItemRequest request, CancellationToken cancellationToken)
    {
        await _sender.Send(new UpdateTodoItemCommand(id, request.Title, request.Description, request.DueDate), cancellationToken);
        return NoContent();
    }

    [HttpPatch("{id}/status")]
    public async Task<IActionResult> ChangeStatus(Guid id, ChangeTodoItemStatusRequest request, CancellationToken cancellationToken)
    {
        await _sender.Send(new ChangeTodoItemStatusCommand(id, request.Status), cancellationToken);
        return NoContent();
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(Guid id, CancellationToken cancellationToken)
    {
        await _sender.Send(new DeleteTodoItemCommand(id), cancellationToken);
        return NoContent();
    }

    public sealed record UpdateTodoItemRequest(string Title, string? Description, DateTimeOffset? DueDate);

    public sealed record ChangeTodoItemStatusRequest(TodoItemStatus Status);
}
