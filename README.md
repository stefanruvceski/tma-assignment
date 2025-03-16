# TMA Monorepo

## 📋 Project Overview

TMA Monorepo is a project that demonstrates the implementation of a microservices architecture with a focus on tracking user limits through an event-driven approach. The project is organized as a monorepo using pnpm workspace, which enables efficient dependency management and code sharing between different services.

### 🚀 Key Features

- **Microservices Architecture** - Independent services with clearly defined responsibilities
- **Event-driven Approach** - Communication between services via events
- **Centralized Libraries** - Shared code for configuration, logging, error handling, etc.
- **Type Safety** - Completely written in TypeScript
- **Testing** - Test coverage for all components

## 🛠️ Technologies

- **Node.js & TypeScript** - Foundation of the project
- **pnpm** - Package manager with workspace support
- **Prisma & MongoDB** - Databases
- **KinesisLite** - Event streaming platform (local version of AWS Kinesis)
- **Jest** - Testing framework
- **Pino** - Logging library
- **dotenv** - Managing environment variables

## 📁 Project Structure

```
tma-monorepo/
├── src/
│   ├── apps/
│   │   ├── user-limit-service/      # Service for tracking user limits
│   │   └── event-publisher-service/ # Service for publishing events
│   ├── libraries/
│   │   ├── config/                  # Library for configuration
│   │   ├── logger/                  # Library for logging
│   │   ├── error-handling/          # Centralized error handling
│   │   ├── database/                # Abstraction for working with DB
│   │   └── event-stream/            # Integration with Kinesis
├── package.json
├── pnpm-workspace.yaml
└── tsconfig.json
```

## 🔍 Component Description

### 📚 Libraries

#### Config

Centralized configuration management through type-safe keys. Loads environment variables from `.env` files and provides easy access to configuration values.

#### Logger

Standardized logging system with different levels (DEBUG, INFO, WARN, ERROR), formatting, and contextual logging.

#### Error-Handling

Robust, centralized error handling that provides consistent management, logging, and response formatting.

#### Database

Database access library that uses Prisma ORM for interaction with MongoDB. Implements a repository for user limit entities.

#### Event-Stream

Abstraction for working with streaming services. Currently supports AWS Kinesis as a data streaming adapter.

### 🖥️ Applications

#### User-Limit-Service

Service for tracking user limits. Provides an API for reading limits from the database and consumes events from the Kinesis stream.

#### Event-Publisher-Service

Service for publishing events to the Kinesis stream. Used for simulating events that are sent to the system.

## ⚙️ Prerequisites

- Node.js (v18 or newer)
- pnpm (v8 or newer)
- Docker and Docker Compose
- MongoDB (local or in the cloud)
- AWS CLI (for local Kinesis emulation)

## 🚀 Project Setup

### 1. Clone the Repository

```bash
git clone https://github.com/stefanruvceski/tma-assignment.git
cd tma-template
```

### 2. Install Dependencies

```bash
pnpm install
```

### 3. Configuration

Copy `.env.example` to `.env` and set the following variables:

```env
TEST_SERVICE_PORT=5001
EVENT_STREAM_ENDPOINT=http://localhost:4567
DB_CONNECTION_STRING=your_mongodb_connection_string
AWS_ACCESS_KEY_ID=your_aws_key
AWS_SECRET_ACCESS_KEY=your_aws_secret
AWS_REGION=us-east-1
AWS_STREAM_NAME=test-stream
```

### 4. Build Packages

```bash
pnpm build
```

### 5. Database Setup

If you're using MongoDB Atlas:

1. Create an account on [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a new cluster
3. Get the connection string and set it in the `.env` file

If you're using a local MongoDB instance:

1. Run MongoDB locally
2. Set the connection string in the `.env` file (e.g., `mongodb://localhost:27017/tma-db`)

### 6. Generate Prisma Client

```bash
cd src/libraries/database
pnpm prisma:generate
pnpm db:push
```

### 7. Install kinesisLite and run it in your terminal (it will run on http://localhost:4567)

```bash
npm install kinesalite && kinesalite
```

## 🚀 Running the Project

### 1. Run All Services in Development Mode

```bash
pnpm dev
```

### 2. Run Only a Specific Service

```bash
pnpm --filter user-limit-service dev-api or dev-queue
```

### 3. Run the Event Simulator

```bash
pnpm --filter event-publisher-service dev
```

## 🧪 Testing

### 1. Run All Tests

```bash
pnpm test
```

### 2. Run Tests for a Specific Service/Library

```bash
pnpm --filter user-limit-service test
```

## 🤝 Contributing to the Project

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 Project Tasks

- [x] [TMA-01] Initialize project with core files and create GitHub repository
- [x] [TMA-02] File structure for libraries/applications
- [x] [TMA-03] Implement config library and test it
- [x] [TMA-04] Implement logger library and test it
- [x] [TMA-05] Implement error-handling library and test it
- [x] [TMA-06] Implement database library and test it
- [x] [TMA-07] Implement event-stream library and test it
- [x] Implement user-limit-service and test it
  - [x] [TMA-08] Add data-access layer
  - [x] [TMA-09] Add domain layer - service logic and validators
  - [x] [TMA-10] Add entry-points layer - API routes and event-stream handler
  - [x] [TMA-11] Add tests for service classes
- [x] [TMA-12] Implement simulator - adding events from events.json to kinesislite stream
- [x] [TMA-13] Create README file for easier project setup and testing
- [x] [TMA-14] fix small bugs
- [x] [TMA-15] add comments for easier code understanding
- [ ] [TMA-16] Answer Questions from PDF assignment

## Future Add-ons

### 📊 API Documentation

API documentation is available at:

- Swagger UI: `http://localhost:5001/api-docs`
- OpenAPI specification: `http://localhost:5001/api-docs.json`

### 🐳 Docker

Run the entire project in Docker containers:

```bash
docker-compose up -d
```
