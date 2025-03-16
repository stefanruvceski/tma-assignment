import {
  CreateStreamCommand,
  ListStreamsCommand,
  PutRecordCommand,
} from '@aws-sdk/client-kinesis';
import KinesisAdapter from '../adapters/kinesis.adapter'; // Adjust the path if needed

jest.mock('@aws-sdk/client-kinesis', () => {
  const actual = jest.requireActual('@aws-sdk/client-kinesis');
  return {
    ...actual,
    KinesisClient: jest.fn(() => ({
      send: jest.fn(),
      destroy: jest.fn(),
    })),
  };
});

describe('KinesisAdapter', () => {
  let adapter: KinesisAdapter;
  let sendMock: jest.Mock;

  beforeEach(() => {
    adapter = new KinesisAdapter();
    sendMock = (adapter as any).client.send as jest.Mock;
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test('should create a stream', async () => {
    sendMock.mockResolvedValueOnce({});

    await adapter.createStream('test-stream');

    expect(sendMock).toHaveBeenCalledWith(expect.any(CreateStreamCommand));
    expect(sendMock).toHaveBeenCalledTimes(1);
  });

  test('should return a list of streams', async () => {
    sendMock.mockResolvedValueOnce({ StreamNames: ['stream1', 'stream2'] });

    const streams = await adapter.getStreams();

    expect(sendMock).toHaveBeenCalledWith(expect.any(ListStreamsCommand));
    expect(streams).toEqual(['stream1', 'stream2']);
  });

  test('should create a record', async () => {
    sendMock.mockResolvedValueOnce({});

    await adapter.createRecord('message', 'test-stream', 'partitionKey');

    expect(sendMock).toHaveBeenCalledWith(expect.any(PutRecordCommand));
  });

  test('should get records from a stream', async () => {
    sendMock
      .mockResolvedValueOnce({
        StreamDescription: { Shards: [{ ShardId: 'shard-123' }] },
      }) // DescribeStreamCommand
      .mockResolvedValueOnce({ ShardIterator: 'iterator-123' }) // GetShardIteratorCommand
      .mockResolvedValueOnce({
        Records: [{ Data: Buffer.from(JSON.stringify({ msg: 'test' })) }],
      }); // GetRecordsCommand

    const records = await adapter.getRecords('test-stream');

    expect(sendMock).toHaveBeenCalledTimes(3);
    expect(records).toEqual([{ msg: 'test' }]);
  });

  test('should destroy the client', async () => {
    const destroyMock = jest.spyOn((adapter as any).client, 'destroy');

    await adapter.destroy();

    expect(destroyMock).toHaveBeenCalledTimes(1);
  });
});
