import mockedEvents from '../events.json';
import ConfigProvider, { configKey } from '@tma-monorepo/config';
import createEventHandler, { AdapterType } from '@tma-monorepo/event-stream';
import { Event } from './event.interface';
import { logger } from '@tma-monorepo/logger';
import { AppError } from '@tma-monorepo/error-handling';

const publishEvents = async (): Promise<void> => {
  const config = new ConfigProvider('event-publisher-service');
  const streamName = config.getValue(configKey.aws_stream_name) as string;

  const kinesisAdapter = createEventHandler(AdapterType.KINESIS);

  const streams = await kinesisAdapter.getStreams();

  if (!streams.includes(streamName)) {
    logger.info(`Creating stream ${streamName}`);
    await kinesisAdapter.createStream(streamName);
    await new Promise((resolve) => setTimeout(resolve, 2000));
  }

  for (const event of mockedEvents as Event[]) {
    try {
      await kinesisAdapter.createRecord(
        JSON.stringify(event),
        streamName,
        event.payload.userId
      );
      logger.info(`Created Event ${event.eventId} type ${event.type}`);
    } catch (error) {
      console.log(error);
      new AppError(
        '[event-publisher-service] error-creating-event',
        `Error Creating Event ${error}`,
        500,
        false,
        error instanceof AppError ? error.cause : undefined
      );
    }
  }
};

export default publishEvents;
