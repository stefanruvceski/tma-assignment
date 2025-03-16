import { AppError } from '@tma-monorepo/error-handling';
import { ValidateFunction } from 'ajv';
import { userLimitSchema } from './user-limit.schema';
import AJV from 'ajv';
import { UserLimit } from '@tma-monorepo/database';

const ajv = new AJV();
export function assertNewUserLimitIsValid(newUserLimitRequest: UserLimit) {
  let validationSchema!: ValidateFunction<typeof userLimitSchema> | undefined;
  validationSchema = ajv.getSchema<typeof userLimitSchema>('new-user-limit');

  if (!validationSchema) {
    ajv.addSchema(userLimitSchema, 'new-user-limit');
    validationSchema = ajv.getSchema<typeof userLimitSchema>('new-user-limit');
  }

  if (validationSchema === undefined) {
    throw new AppError(
      '[user-limit-service] unpredictable-validation-failure',
      'An internal validation error occured where schemas cant be obtained',
      500,
      false
    );
  }
  const isValid = validationSchema(newUserLimitRequest);
  if (!isValid) {
    throw new AppError(
      '[user-limit-service] invalid-new-user-limit-validation',
      `Validation failed for new user limit`,
      400,
      true,
      validationSchema.errors
    );
  }
}
