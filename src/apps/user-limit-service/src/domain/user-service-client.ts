import { AppError } from '@tma-monorepo/error-handling';
import axios from 'axios';

// Assert user exists by sending a request to dummyjson
// In real case, we would have a user service that would be queried
export async function assertUserExists(userId: string): Promise<{
  id: string;
  status: string;
}> {
  const userVerificationRequest = await axios.get(
    `https://dummyjson.com/http/200/${userId}`,
    {
      validateStatus: () => true,
    }
  );
  if (userVerificationRequest.status !== 200) {
    throw new AppError(
      'user-doesnt-exist',
      `The user ${userId} doesnt exist`,
      userVerificationRequest.status,
      true
    );
  }

  return userVerificationRequest.data;
}
