import { Type } from '@sinclair/typebox';
import { LimitStatus, LimitType, LimitPeriod } from '@tma-monorepo/database';

// Enums as TypeBox literals
export const LimitStatusSchema = Type.Enum(LimitStatus);
export const LimitPeriodSchema = Type.Enum(LimitPeriod);
export const LimitTypeSchema = Type.Enum(LimitType);

// UserLimit schema
export const userLimitSchema = Type.Object({
  activeFrom: Type.Number(),
  activeUntil: Type.Optional(Type.Union([Type.Number(), Type.Null()])),
  brandId: Type.String(),
  createdAt: Type.Optional(Type.Union([Type.Number(), Type.Null()])),
  currencyCode: Type.String(),
  nextResetTime: Type.Optional(Type.Union([Type.Number(), Type.Null()])),
  period: LimitPeriodSchema,
  previousLimitValue: Type.Optional(Type.Union([Type.String(), Type.Null()])),
  progress: Type.Optional(Type.Union([Type.String(), Type.Null()])),
  status: LimitStatusSchema,
  type: LimitTypeSchema,
  userId: Type.String(),
  userLimitId: Type.Optional(Type.String()),
  value: Type.String(),
});

// // Type definition for TypeScript
// export type UserLimitDTO = {
//   activeFrom: bigint;
//   activeUntil?: bigint;
//   brandId: string;
//   createdAt?: bigint;
//   currencyCode: string;
//   nextResetTime?: bigint;
//   period: LimitPeriod;
//   previousLimitValue?: string;
//   progress?: string;
//   status: LimitStatus;
//   type: LimitType;
//   userId: string;
//   userLimitId: string;
//   value: string;
// };
