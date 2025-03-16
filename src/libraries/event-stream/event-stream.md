# Event Stream Library

Event Stream is a TypeScript library that provides an abstraction for working with streaming services. Currently supports AWS Kinesis as a streaming data adapter.

## Usage

```typescript
import createEventHandler, { AdapterType } from '@tma-monorepo/event-stream';

// Create an event handler instance with Kinesis adapter
const eventHandler = createEventHandler(AdapterType.KINESIS);
```

### Available Operations

#### Creating a Stream

```typescript
const streamName = 'my-stream';
await eventHandler.createStream(streamName);

// Stream will be created with one shard (ShardCount: 1)
// Wait a few seconds for the stream to become active before sending data
```

#### Getting Stream List

```typescript
// Returns a list of all available streams
const streams = await eventHandler.getStreams();
console.log('Available streams:', streams);

// Example of checking if a stream exists
const streamExists = streams.includes('my-stream');
```

#### Creating Records

```typescript
// Simple string record
const message = 'My message';
const streamName = 'my-stream';
const partitionKey = 'key-1';
await eventHandler.createRecord(message, streamName, partitionKey);

// JSON object as a message
const jsonMessage = JSON.stringify({
  id: 123,
  type: 'notification',
  content: 'New message',
  timestamp: new Date().toISOString(),
});
await eventHandler.createRecord(jsonMessage, streamName, 'notifications');

// Example of sending batch messages
async function sendBatchMessages(messages: string[]) {
  for (const msg of messages) {
    await eventHandler.createRecord(
      msg,
      'my-stream',
      `partition-${Math.floor(Math.random() * 100)}`
    );
  }
}
```

#### Reading Records

```typescript
const streamName = 'my-stream';
const records = await eventHandler.getRecords(streamName);
```

#### Real-time Stream Monitoring

```typescript
async function monitorStream(streamName: string, interval = 5000) {
  while (true) {
    const records = await eventHandler.getRecords(streamName);
    if (records.length > 0) {
      console.log(`Received ${records.length} new records`);
      // Process records
    }
    await new Promise((resolve) => setTimeout(resolve, interval));
  }
}

// Start monitoring
monitorStream('my-stream').catch(console.error);
```

#### Destroying Connection

```typescript
// Always call destroy when you're done using the event handler
await eventHandler.destroy();
```

## Interface

The library implements the `IEventStreamAdapter` interface which defines the following methods:

```typescript
interface IEventStreamAdapter {
  createStream: (
    streamName: string
  ) => Promise<CreateStreamCommandOutput | undefined>;
  getStreams: () => Promise<string[]>;
  createRecord: (
    msg: string,
    streamName: string,
    partitionKey: string
  ) => Promise<PutRecordCommandOutput | undefined>;
  getRecords: (streamName: string) => Promise<any[]>;
  destroy: () => Promise<void>;
}
```

## Configuration

For the Kinesis adapter, the following environment variables need to be set in the service configuration:

- AWS_REGION - AWS region where Kinesis is located (e.g., 'eu-central-1')
- EVENT_STREAM_ENDPOINT - Endpoint for the Kinesis service
- AWS_ACCESS_KEY_ID - AWS access key
- AWS_SECRET_ACCESS_KEY - AWS secret key

Example configuration in .env file:

```
AWS_REGION=eu-central-1
EVENT_STREAM_ENDPOINT=http://localhost:4566
AWS_ACCESS_KEY_ID=test
AWS_SECRET_ACCESS_KEY=test
```

## Error Handling

Errors can be caught as follows:

```typescript
try {
  await eventHandler.createRecord(message, 'non-existent-stream', 'key-1');
} catch (error) {
  // Error handler will already log the error
  // Here you can add specific error handling logic
  console.error('Error sending message:', error.message);
}
```
