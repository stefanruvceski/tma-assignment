## 1. What did you like about the task and what didn’t? Can we improve it and how?

- What I liked:

  - The task was well-structured with a clear goal: implementing a system to manage user limits in an event-driven architecture. This clarity allowed to focus on designing a scalable solution together.

  - I appreciated the emphasis on abstraction and modularity, which encouraged to decouple components like the repository and streaming services. This made the system flexible and easier to test.

  - Working with modern tools like TypeScript, Prisma, and TypeBox for schema validation felt relevant and aligned with current industry practices, which made the task enjoyable.

- What I didn’t like:

  - Some ambiguity around the UserLimit model (e.g., mandatory fields or validation rules) slowed implementation down a bit, as I had to make assumptions during implementation.

  - There was a lack of specific business context, such as performance expectations or data volume requirements.

## 2. If you were asked to change it so the `UserLimit` entries are stored on a database with a primary goal to provide them back to the front-end for display, which one would you suggest and why? What sub-tasks you would see as a necessary if you were asked to write a story for such change?

#### Given the request to select a database for storing UserLimit entries with the primary goal of providing them back to the front-end for display, I’d recommend MongoDB. Implementing it with Prisma, it aligns perfectly with glexibility to change if needed. Here’s why it’s a strong choice and the subtasks required to implement this change.

##### Why MongoDB?

- Simplicity for Events: MongoDB’s schema-less design is ideal for event-driven systems, where complex relationships between entities aren’t required. This matches use case.

- Efficient Reads and Writes: Its high throughput for both reading and writing makes it perfect for quickly retrieving UserLimit data for front-end display and handling frequent updates.
- Prisma Compatibility: simplifies database interactions with type-safe queries and schema management, streamlining development and maintenance.
- Flexibility: The schema-less nature allows easy adaptation to evolving requirements without major refactoring.

#### Subtasks for Implementation

- Database Schema Definition
  Define the UserLimit schema in Prisma (e.g., fields like userLimitId, userId, activeFrom, activeUntil).
  Generate TypeScript types from the schema for type safety across the app.
- Repository Implementation
  Create a MongoUserLimitRepository class implementing an IUserLimitRepository interface.
  Use Prisma for CRUD operations (create, read, update, delete) within the repository.
  Keep it abstract (e.g., inheriting from an abstract repository class) to allow switching databases via Prisma and simplify adding new entities.
- Service Layer Integration
  Update the service layer to use the MongoUserLimitRepository for fetching and storing UserLimit data.
  Ensure the service exposes the data in a format suitable for the front-end.
- Data Validation
  Validate UserLimit data before storage (e.g., using TypeBox or similar) to ensure consistency and prevent invalid entries.
- Testing
  Write unit tests for the repository and integration tests to verify database interactions.
  Test edge cases like concurrent updates or missing data.

## 3. What you would suggest for an API to return this data to front-end for a user? What would be the API signature?

- For a simple task where the codebase already uses Express, a popular Node.js standard, I’d recommend sticking with a RESTful API. It’s lightweight, aligns with the existing setup, and efficiently delivers data to the frontend for basic scenarios involving minimal data or a single entity. This approach keeps development straightforward and leverages familiar tools, making it ideal for smaller, less complex requirements.

- However, in a more dynamic, data-intensive context—where various frontend components or external applications don’t always need the full dataset—GraphQL would be a superior choice. It allows clients to request only the specific data they need, reducing over-fetching and improving efficiency. With its strongly typed schema and support for complex queries, GraphQL offers scalability and precision, making it a strategic fit for modern, event-driven systems with evolving demands.

- For the API signature, it depends on the approach chosen. With a RESTful API using Express, it would be a standard HTTP endpoint like GET /users/:id, where :id is a dynamic parameter identifying the user, returning a JSON response with the user’s data. This is simple, explicit, and aligns with REST conventions for resource retrieval. Alternatively, if using GraphQL, the signature would be a single endpoint, typically POST /graphql, accepting a query in the request body. The client specifies the data structure via a GraphQL query, and the response mirrors that structure in JSON. This offers flexibility, allowing the frontend to define exactly what data it needs, though it consolidates all operations into one route.

## 4. How did/could you implement it so it’s possible to re-use it for other similar use cases?

- I interpret the question about reusability as an inquiry into how the solution’s design supports extensibility across similar use cases, though the specific component isn’t specified. The current implementation of the user-limit-service is architected with modularity and reusability at its core. It leverages internal packages to encapsulate key functionalities: a centralized package for managing .env variables, an abstracted data access layer for reading and writing user-limit data, and a dedicated error-handling package for consistent exception management. This structure ensures loose coupling and promotes separation of concerns, foundational principles for scalable backend systems.

- This design pays dividends when scaling to new services, such as a user-service. The groundwork is already laid: extending the database schema with a user model is straightforward, followed by implementing a repository that inherits from an abstract db-entity class. This abstraction standardizes data access patterns across services, minimizing boilerplate and ensuring consistency. A new microservice can then seamlessly manipulate data via the repository class from the database package, integrating with the existing ecosystem. By prioritizing reusable components and a modular architecture, the solution not only accelerates development but also maintains robustness and maintainability—hallmarks of a well-engineered backend system.
