import { AppError } from '@tma-monorepo/error-handling';
import KinesisAdapter from './adapters/kinesis.adapter';
import {
  AdapterType,
  IEventStreamAdapter,
} from './interfaces/event-stream-adapter.interface';

// Create event handler for different event stream adapters - easily extendable
const createEventHandler = (adapterType: AdapterType): IEventStreamAdapter => {
  switch (adapterType) {
    case AdapterType.KINESIS:
      return new KinesisAdapter();
    default:
      throw new AppError(
        `[event-stream] unsupported-adapter-type`,
        `Unsupported adapter type for event stream ${adapterType}`
      );
  }
};
export { IEventStreamAdapter, AdapterType };
export default createEventHandler;
