# Error Handling Library

A robust, centralized error handling solution for your application that provides consistent error management, logging, and response formatting.

## Features

- Centralized error handling
- Detailed error tracking and logging
- Built-in security for sensitive error information
- Standardized error response format
- Easy integration with existing projects
- TypeScript support out of the box

## Installation

```json
{
  "dependencies": {
    "@tma-monorepo/error-handling": "workspace:*"
  }
}
```

## Usage

### Basic Example

```typescript
import { ErrorHandler, AppError } from '@internal/error-handling';

// Create a custom error
throw new AppError(
    'user-not-found',   // name
    'User not found',   // message
    404,                // HTTPStatus
    false,              // isCatastrophic
    {some}              // cause
});

// Global error handler setup
app.use(ErrorHandler.middleware);
```

### Error Handling

```typescript
start()
  .then((startResponses) => {
    logger.info(
      `The app has started successfully on port: ${startResponses[0].port}`
    );
  })
  .catch((error) => {
    errorHandler.handleError(
      new AppError('startup-failure', error.message, 500, false, error)
    );
  });
```

## Benefits of Centralized Error Handling

1. **Consistency**:

   - Standardized error format across your entire application
   - Unified error handling logic
   - Consistent HTTP status codes and error messages

2. **Maintainability**:

   - Single source of truth for error handling
   - Easier to update and modify error handling logic
   - Reduced code duplication

3. **Better Debugging**:

   - Detailed error tracking
   - Structured error logs
   - Easy to identify error patterns

4. **Security**:

   - Control over error information exposure
   - Sanitized error messages for production
   - Prevention of sensitive data leaks

5. **Developer Experience**:
   - Clean and readable code
   - Type safety with TypeScript
   - Reduced boilerplate code

## Error Response Format

All errors are transformed into a consistent format:

```typescript
{
  success: false,
  error: {
    code: string;        // Error code (e.g., 'USER_NOT_FOUND')
    message: string;     // User-friendly error message
    statusCode: number;  // HTTP status code
    details?: object;    // Additional error details (optional)
    stack?: string;      // Stack trace (development only)
  }
}
```
