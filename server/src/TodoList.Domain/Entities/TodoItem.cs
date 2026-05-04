using TodoList.Domain.Enums;

namespace TodoList.Domain.Entities;

public class TodoItem
{
    public Guid Id { get; private set; }

    public string Title { get; private set; }

    public string? Description { get; private set; }

    public DateTimeOffset? DueDate { get; private set; }

    public TodoItemStatus Status { get; private set; }

    public DateTimeOffset CreatedAtUtc { get; private set; }

    private TodoItem()
    {
        Title = string.Empty;
    }

    public TodoItem(string title, string? description, DateTimeOffset? dueDate)
    {
        Id = Guid.NewGuid();
        Title = title;
        Description = description;
        DueDate = dueDate;
        Status = TodoItemStatus.Todo;
        CreatedAtUtc = DateTimeOffset.UtcNow;
    }

    public void Update(string title, string? description, DateTimeOffset? dueDate)
    {
        Title = title;
        Description = description;
        DueDate = dueDate;
    }

    public void SetStatus(TodoItemStatus status)
    {
        Status = status;
    }
}
