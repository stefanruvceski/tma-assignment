import {
  CreateStreamCommand,
  DescribeStreamCommand,
  GetRecordsCommand,
  GetShardIteratorCommand,
  KinesisClient,
  KinesisClientConfig,
  ListStreamsCommand,
  PutRecordCommand,
} from '@aws-sdk/client-kinesis';
import { NodeHttpHandler } from '@smithy/node-http-handler';
import ConfigProvider, { configKey } from '@tma-monorepo/config';
import { errorHandler } from '@tma-monorepo/error-handling';
import { logger } from '@tma-monorepo/logger';
import { IEventStreamAdapter } from '../interfaces/event-stream-adapter.interface';
const config = new ConfigProvider('test_service');

const kinesisConfig: KinesisClientConfig = {
  region: config.getValue(configKey.aws_region) as string,
  endpoint: config.getValue(configKey.event_stream_endpoint) as string,
  credentials: {
    accessKeyId: config.getValue(configKey.aws_access_key_id) as string,
    secretAccessKey: config.getValue(configKey.aws_secret_access_key) as string,
  },
  requestHandler: new NodeHttpHandler(),
};

export default class KinesisAdapter implements IEventStreamAdapter {
  private client: KinesisClient;
  constructor() {
    this.client = new KinesisClient(kinesisConfig);
  }
  async createStream(streamName: string) {
    try {
      const createStreamResponse = await this.client.send(
        new CreateStreamCommand({ StreamName: streamName, ShardCount: 1 })
      );
      return createStreamResponse;
    } catch (error) {
      errorHandler.handleError(error);
    }
  }

  async getStreams(): Promise<string[]> {
    try {
      const getStreamsResponse = await this.client.send(
        new ListStreamsCommand({
          Limit: 1,
        })
      );
      const streams = getStreamsResponse.StreamNames ?? [];
      return streams;
    } catch (error) {
      errorHandler.handleError(error);
    }
    return [];
  }

  async createRecord(msg: string, streamName: string, partitionKey: string) {
    try {
      const createRecordResponse = await this.client.send(
        new PutRecordCommand({
          StreamName: streamName,
          Data: Buffer.from(msg),
          PartitionKey: partitionKey,
        })
      );
      return createRecordResponse;
    } catch (error) {
      errorHandler.handleError(error);
    }
  }

  async getRecords(streamName: string): Promise<any[]> {
    try {
      const describeResponse = await this.client.send(
        new DescribeStreamCommand({
          StreamName: streamName,
        })
      );
      const shardId = describeResponse.StreamDescription?.Shards?.[0]?.ShardId;

      const iteratorResponse = await this.client.send(
        new GetShardIteratorCommand({
          StreamName: streamName,
          ShardId: shardId,
          ShardIteratorType: 'TRIM_HORIZON',
        })
      );
      const shardIterator = iteratorResponse.ShardIterator;

      const recordsResponse = await this.client.send(
        new GetRecordsCommand({
          ShardIterator: shardIterator,
        })
      );

      const messages = recordsResponse.Records?.map((record) => {
        return JSON.parse(
          Buffer.from(record.Data ?? new Uint8Array()).toString('utf8')
        );
      });

      if (recordsResponse.Records?.length === 0) {
        logger.info('No messages in stream yet');
      }
      return messages ?? [];
    } catch (error) {
      errorHandler.handleError(error);
    }
    return [];
  }

  async destroy() {
    this.client.destroy();
    logger.info('Kinesis client destroyed');
  }
}
