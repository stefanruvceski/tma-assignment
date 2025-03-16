import {
  CreateStreamCommandOutput,
  PutRecordCommandOutput,
} from '@aws-sdk/client-kinesis';

export interface IEventStreamAdapter {
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

export enum AdapterType {
  KINESIS = 'kinesis',
}
