# Config Library

## Overview

The Config library provides a centralized way to manage configuration settings across your application. It simplifies the process of loading environment variables from `.env` files and provides type-safe access to configuration values.

## Features

- Loads environment variables from both root and service-specific `.env` files
- Provides type-safe access to configuration values
- Supports environment variable expansion
- Centralizes configuration management across services

## Installation

````json
{
  "dependencies": {
    "@tma-monorepo/config": "workspace:*"
  }
}

## Usage

### Basic Usage

```typescript
import ConfigProvider, { configKey } from '@tma-monorepo/config';

// Initialize with service name
const config = new ConfigProvider('my_service');

// Access configuration values using type-safe keys
const port = config.getValue(configKey.port);
const dbConnectionString = config.getValue(configKey.db_connection_string);
````

### Available Configuration Keys

The library provides the following configuration keys:

```typescript
// Access using configKey.key_name
{
  port: number;
  test_env: string;
  service_name: string;
  db_connection_string: string;
  event_stream_endpoint: string;
  aws_access_key_id: string;
  aws_secret_access_key: string;
  aws_region: string;
  aws_stream_name: string;
  pretty_print: boolean;
}
```

## Environment Variables

The library loads environment variables from:

1. Root `.env` file (located at the project root)
2. Service-specific `.env` file (located in the service directory)

Service-specific variables take precedence over root variables.

### Service-Specific Variables

For service-specific configuration, use the following naming convention:

```
SERVICE_NAME_PORT=5001
```

Where `SERVICE_NAME` is the uppercase name of your service.

## Why Use This Library?

- **Centralized Configuration**: Manage all configuration in one place
- **Type Safety**: Get compile-time errors for invalid configuration keys
- **Environment Isolation**: Separate configuration for different environments
- **Simplified Testing**: Easy to mock configuration for tests
- **Consistent Access Pattern**: Standardized way to access configuration across services

## Example

```typescript
// Initialize config for a specific service
const config = new ConfigProvider('user_service');

// Connect to database
const dbClient = createDbClient({
  connectionString: config.getValue(configKey.db_connection_string),
});

// Start server
const app = express();
app.listen(config.getValue(configKey.port), () => {
  console.log(
    `${config.getValue(
      configKey.service_name
    )} running on port ${config.getValue(configKey.port)}`
  );
});
```
