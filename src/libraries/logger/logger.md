# Logger Library Documentation

## Overview

The Logger library provides a standardized way to handle logging across the application. It offers different log levels, formatting options, and the ability to configure output destinations.

## Features

- Multiple log levels (DEBUG, INFO, WARN, ERROR)
- Timestamp-based logging
- Context-based logging
- Performance optimized

## Installation

The logger is available as an internal library. No additional installation is required as it's part of the project's core libraries.

## Basic Usage

```typescript
import { logger } from '@tma-monorepo/logger';

// Basic logging
logger.info('User logged in successfully');
logger.error('Failed to connect to database');
logger.warn('API rate limit approaching');
logger.debug('Processing payload:', payload);
```

## Log Levels

The library supports the following log levels in order of severity:

1. DEBUG - Detailed information for debugging
2. INFO - General information about system operation
3. WARN - Warning messages for potentially harmful situations
4. ERROR - Error messages for serious problems

## Advanced Usage

### With Context

```typescript
// Adding context to logs
logger.info('Order processed', {
  orderId: '12345',
  amount: 99.99,
  currency: 'USD',
});

// Error logging with stack trace
try {
  // Some operation
} catch (error) {
  logger.error('Failed to process payment', {
    error,
    orderId: '12345',
    timestamp: new Date().toISOString(),
  });
}
```

### Configuration

```typescript
// Configure logger settings
logger.configure({
  level: 'debug',
  prettyPrint: true,
});
```

## Best Practices

1. **Use Appropriate Log Levels**

   - DEBUG: For detailed debugging information
   - INFO: For general operational information
   - WARN: For potentially harmful situations
   - ERROR: For errors that need immediate attention

2. **Include Relevant Context**

   ```typescript
   // Good
   logger.info('User action completed', {
     userId: user.id,
     action: 'document_upload',
     fileSize: '2.5MB',
   });

   // Avoid
   logger.info('Action completed'); // Too vague
   ```

3. **Structured Error Logging**

   ```typescript
   try {
     await processOrder(orderId);
   } catch (error) {
     logger.error('Order processing failed', {
       orderId,
       errorCode: error.code,
       errorMessage: error.message,
       stack: error.stack,
     });
   }
   ```

4. **Performance Considerations**
   - Use debug level judiciously in production
   - Avoid logging sensitive information
   - Consider log rotation for file outputs

## API Reference

### Methods

#### `logger.debug(message: string, context?: object)`

Logs debug level information

#### `logger.info(message: string, context?: object)`

Logs informational messages

#### `logger.warn(message: string, context?: object)`

Logs warning messages

#### `logger.error(message: string, context?: object)`

Logs error messages

### Configuration Options

## Examples for Common Use Cases

### API Request Logging

```typescript
app.use((req, res, next) => {
  logger.info('Incoming request', {
    method: req.method,
    path: req.path,
    ip: req.ip,
    userAgent: req.headers['user-agent'],
  });
  next();
});
```

### Error Boundary Logging

```typescript
class ErrorBoundary extends React.Component {
  componentDidCatch(error, errorInfo) {
    logger.error('UI Error', {
      error,
      component: errorInfo.componentStack,
    });
  }
}
```

### Performance Monitoring

```typescript
const startTime = performance.now();
try {
  await heavyOperation();
  logger.info('Operation completed', {
    duration: `${performance.now() - startTime}ms`,
  });
} catch (error) {
  logger.error('Operation failed', {
    duration: `${performance.now() - startTime}ms`,
    error,
  });
}
```

## Troubleshooting

Common issues and their solutions:

1. **Logs not appearing**

   - Check the configured log level
   - Verify file permissions if using file output
   - Ensure logger is properly imported

2. **Performance Issues**
   - Reduce debug logging in production
   - Use appropriate log levels
   - Consider async logging for large payloads

## Contributing

When contributing to the logger library:

1. Follow the existing code style
2. Add tests for new features
3. Update this documentation
4. Consider backwards compatibility
