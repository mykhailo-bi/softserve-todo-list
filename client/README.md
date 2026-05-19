# Angular + RxJS Todo List Frontend

A comprehensive todo list application frontend built with Angular 21, RxJS, Angular Material, and NgRx for state management. Includes comprehensive Jest unit tests.

## Features

- ✅ **Full CRUD operations** for todo items
- ✅ **Status management** (Todo, In Progress, Done)
- ✅ **Due date tracking** with calendar picker
- ✅ **Status filtering** to view todos by status
- ✅ **Responsive design** with Angular Material UI components
- ✅ **State management** with NgRx (Store + Effects)
- ✅ **Reactive programming** with RxJS
- ✅ **Comprehensive unit tests** with Jest (80%+ coverage)

## Tech Stack

- **Angular 21** - Modern web framework
- **RxJS 7** - Reactive programming
- **Angular Material 21** - Material Design UI components
- **NgRx 21** - Redux-inspired state management
  - Store - Centralized state
  - Effects - Side effects management
  - Selectors - Optimized state queries
- **Jest 30** - Unit testing framework
- **TypeScript 5.9** - Type-safe development

## Architecture

### Component Structure

```
src/app/
├── components/
│   ├── todo-list/           # Main list view with filtering
│   ├── todo-item/            # Individual todo card with actions
│   └── todo-form-dialog/     # Create/Edit modal dialog
├── models/
│   ├── todo-item.model.ts    # TypeScript interfaces
│   └── todo-item-status.enum.ts  # Status enumeration
├── services/
│   └── todo-items.service.ts # HTTP API client
└── store/
    └── todos/
        ├── todos.actions.ts   # NgRx actions
        ├── todos.reducer.ts   # State reducer
        ├── todos.selectors.ts # State selectors
        ├── todos.effects.ts   # Side effects
        └── todos.state.ts     # State interface
```

### State Management

The application uses NgRx for predictable state management:

- **Actions**: Define all state mutations (load, create, update, delete, filter)
- **Reducer**: Pure functions that handle state transitions
- **Effects**: Handle async operations (API calls) and side effects
- **Selectors**: Memoized state queries for optimal performance

### API Integration

The `TodoItemsService` communicates with the .NET backend API:

- GET `/api/TodoItems` - Fetch all todos (optional status filter)
- POST `/api/TodoItems` - Create new todo
- PUT `/api/TodoItems/{id}` - Update existing todo
- PATCH `/api/TodoItems/{id}/status` - Change todo status
- DELETE `/api/TodoItems/{id}` - Delete todo

## Development

### Prerequisites

- Bun 1.0+ or Node.js 20+
- .NET 9.0 SDK (for backend)
- SQL Server (for backend database)

### Installation

```bash
cd client
bun install
```

### Running the App

```bash
# Development server (http://localhost:4200)
bun run start

# Build for production
bun run build

# Watch mode for development
bun run watch
```

### Environment Variables

Create a `.env` file in the project root (parent of `/client`):

```env
NG_APP_API_BASE_URL=http://localhost:5097
```

The frontend will automatically load this configuration.

## Testing

### Unit Tests

The application includes comprehensive Jest unit tests with excellent code coverage:

#### Test Suites:

1. **Service Tests** (`todo-items.service.spec.ts`)
   - HTTP method testing (GET, POST, PUT, PATCH, DELETE)
   - Query parameter handling
   - Error handling

2. **Store Tests**
   - **Reducer** (`todos.reducer.spec.ts`) - State mutations
   - **Selectors** (`todos.selectors.spec.ts`) - State queries
   - **Effects** (`todos.effects.spec.ts`) - Async operations

3. **Component Tests**
   - **TodoListComponent** - List view, filtering, dialog opening
   - **TodoItemComponent** - Status changes, edit/delete actions
   - **TodoFormDialogComponent** - Form validation, create/update

### Running Tests

```bash
# Install dependencies with npm
npm install

# Run tests with coverage
npm test -- --coverage

# Run specific test file
npm test -- src/app/services/todo-items.service.spec.ts

# Run tests in watch mode
npm test -- --watch
```

**Note**: Use npm (not bun) for running tests as Angular requires specific Jest configuration with zone.js and the Angular compiler.

### Test Coverage

**All 94 tests passing** with the following coverage:

| Metric     | Coverage |
|------------|----------|
| Statements | 91.49%   |
| Branches   | 86.53%   |
| Functions  | 91.89%   |
| Lines      | 90.90%   |

Coverage includes:
- ✅ All service methods (100%)
- ✅ NgRx actions, selectors (100%)
- ✅ Effects with success and error scenarios (100%)
- ✅ Component interactions and DOM events (95%+)
- ✅ Form validation logic (100%)

## UI Features

### Todo List Component
- Responsive grid layout
- Status filter dropdown
- Add new task button
- Empty state messaging
- Loading spinner
- Error display

### Todo Item Component
- Status badges with color coding
- Due date display with overdue highlighting
- Quick status change buttons
- Edit and delete actions
- Hover effects and animations

### Todo Form Dialog
- Reactive forms with validation
- Title (required, max 200 chars)
- Description (optional, max 1000 chars)
- Due date picker (Angular Material Datepicker)
- Create/Edit mode detection
- Form error messages

## Styling

- **Material Theme**: Custom Indigo/Pink theme
- **Responsive Design**: Mobile-first approach
- **Typography**: Roboto font family
- **Colors**:
  - Todo: Gray (#757575)
  - In Progress: Orange (#fb8c00)
  - Done: Green (#43a047)

## API Models

### TodoItem
```typescript
interface TodoItem {
  id: string;
  title: string;
  description: string | null;
  dueDate: string | null;
  status: TodoItemStatus;
  createdAtUtc: string;
}
```

### TodoItemStatus
```typescript
enum TodoItemStatus {
  Todo = 0,
  InProgress = 1,
  Done = 2
}
```

## Future Enhancements

Potential improvements:
- Drag-and-drop reordering
- Task priorities
- Tags/categories
- Search functionality
- Sorting options
- Bulk operations
- Task duplication
- Subtasks/checklists
- Notifications for overdue tasks

## Known Issues

1. **Bun Compatibility**: While the app runs fine with Bun (`bun run start`), tests must be run with npm due to Angular's requirement for specific Jest setup with zone.js and the JIT compiler.

## License

This project is part of the SoftServe Todo List application.
