import { AppError } from '@tma-monorepo/error-handling';
import axios from 'axios';

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
