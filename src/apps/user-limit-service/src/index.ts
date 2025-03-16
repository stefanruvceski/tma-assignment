import { startListening } from './entry-points/message-queue/user-limit.handler';

// try startListening(true) to test with mocked events
const mocked: boolean = false;
console.log('Starting user limit service');

// Read events from kinesisLite stream and process them
startListening(mocked);
