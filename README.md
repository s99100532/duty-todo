# Duty ToDo App

Duty ToDo App is a full-stack application that allows you to perform CRUD operations on duties. The repository is structured as a monorepo, consisting of two components: frontend and backend.

## Prerequisites

Before getting started, make sure you have the following prerequisites installed:

- NodeJS >= 18
- pnpm (optional, but recommended for workspace feature)
- PostgreSQL or Docker

## Getting Started

Follow the steps below to start using the Duty ToDo App:

### 1. Start the Backend

Navigate to the backend directory:

```sh
cd backend
```

Install the dependencies using your preferred package manager (e.g., pnpm, yarn, or npm):

```sh
pnpm install
```

If the PostgreSQL database is not already running, start it using Docker:

```sh
docker compose up -d
```

Update the `database.json` file for database migration.

Run the database migration to set up the schema:

```sh
pnpm db-migrate up
```

Create a file for environment variable injection during development:

```sh
cp .env.example .env.local
```

Start the backend server:

```sh
pnpm dev
```

### 2. Start the Frontend

Open another terminal window and navigate to the frontend directory:

```sh
cd frontend
```

Install the dependencies using your preferred package manager:

```sh
pnpm install
```

Create a file for environment variable injection during development:

```sh
cp .env.example .env.local
```

Start the frontend development server:

```sh
pnpm dev
```

For more commands and information, please refer to the corresponding component's documentation.

## How to Use the Application

For instructions on how to use the application, please refer to the User Documentation located in the "doc" directory.
