import { errorHandler } from '@tma-monorepo/error-handling';
import mockedEvents from '../../../../../../events.json';
import { UserLimitCommandExecutor } from '../../domain/commands/user-limit-executor.command';
import { createUserLimitService } from '../../domain/user-limit.service';
import createEventHandler, {
  AdapterType,
  IEventStreamAdapter,
} from '@tma-monorepo/event-stream';
import { logger } from '@tma-monorepo/logger';
import ConfigProvider, { configKey } from '@tma-monorepo/config';

const config = new ConfigProvider('user-limit-service');

// Process records from kinesisLite stream
const processRecords = async (
  userLimitExecutor: UserLimitCommandExecutor,
  records: any[]
) => {
  for (const record of records) {
    try {
      await handleEvent(userLimitExecutor, record);
    } catch (error) {
      errorHandler.handleError(error);
    }
  }
};

async function handleEvent(
  userLimitExecutor: UserLimitCommandExecutor,
  event: any
) {
  const { type: eventType, payload: data } = event;
  await userLimitExecutor.executeCommand({
    eventType,
    data,
  });
}

export async function startListening(mocked: boolean = false) {
  try {
    const userLimitExecutor = new UserLimitCommandExecutor(
      createUserLimitService()
    );
    if (mocked) {
      processRecords(userLimitExecutor, mockedEvents);
      return;
    }
    const eventHandler: IEventStreamAdapter = createEventHandler(
      AdapterType.KINESIS
    );
    const records = await eventHandler.getRecords(
      config.getValue(configKey.aws_stream_name) as string
    );
    await processRecords(userLimitExecutor, records);
  } catch (error) {
    errorHandler.handleError(error);
  }
}
