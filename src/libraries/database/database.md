# Database Library

A database access library that uses Prisma ORM for interaction with MongoDB database.

## Features

- Connection to MongoDB database
- Abstract class for database entities
- Implementation of repository

## Installation

```json
{
  "dependencies": {
    "@tma-monorepo/database": "workspace:*"
  }
}
```

## Configuration

The library requires the following environment variables:

- `DB_CONNECTION_STRING` - MongoDB connection string

## Prisma Commands

```bash
# Generate Prisma client
pnpm prisma:generate

# Synchronize schema with database
pnpm db:push

# Run Prisma Studio
pnpm db:studio

# Reset database
pnpm db:reset
```

## Models

### UserLimit

Model for user limitations with the following fields:

- `userLimitId` - Unique identifier
- `activeFrom` - Activity start time
- `activeUntil` - Activity end time
- `brandId` - Brand ID
- `createdAt` - Creation time
- `currencyCode` - Currency code
- `nextResetTime` - Next reset time
- `period` - Limitation period (enum: LimitPeriod)
- `previousLimitValue` - Previous limitation value
- `progress` - Progress
- `status` - Limitation status (enum: LimitStatus)
- `type` - Limitation type (enum: LimitType)
- `userId` - User ID
- `value` - Limitation value

## Repositories

### UserLimitRepository

Repository for working with UserLimit entity that provides the following methods:

- `create(userlimit: UserLimit)` - Create a new limitation
- `update(userLimit: Partial<UserLimit>)` - Update a limitation
- `delete(userLimitId: string)` - Delete a limitation
- `findAll()` - Find all limitations
- `findById(userLimitId: string)` - Find limitation by ID
- `findByUserId(userId: string)` - Find limitations by user ID
- `disconnect()` - Disconnect from the database

## Usage Example

```typescript
import { UserLimitRepository } from '@tma-monorepo/database';

const userLimitRepo = new UserLimitRepository();

// Create a new limitation
const newLimit = await userLimitRepo.create({
  userLimitId: 'unique-id',
  activeFrom: BigInt(Date.now()),
  brandId: 'brand-id',
  currencyCode: 'EUR',
  period: 'DAY',
  status: 'ACTIVE',
  type: 'DEPOSIT',
  userId: 'user-id',
  value: '100',
});

// Find limitations by user ID
const userLimits = await userLimitRepo.findByUserId('user-id');

// Disconnect
await userLimitRepo.disconnect();
```
