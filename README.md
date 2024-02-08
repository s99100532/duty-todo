# Duty ToDo App

A full stack application to perform CURD of duties. The respository is a monorepo that consist of two components: [frontend](./frontend) and [backend](./backend).

## Prerequisite

- NodeJS >= 18
- pnpm installed for the workspace feature (Optional)
- PostgreSQL installed or Docker installed

## Getting started

### 1. Start the backend

```sh
# Please ensure you are in respository root
cd backend
```

```sh
# pnpm can be replaced with any node package manager e.g. yarn, npm
pnpm install
```

Start the postgres database using docker if not exists.

```sh
docker compose up -d
```

Update `database.json` for db migration

Then, run the db migration for schema

```sh
pnpm db-migrate up
```

```sh
# create file for enironment variable injection for development
cp .env.example .env.local
```

```sh
pnpm dev
```

### 2. Start the frontend

Then, Open another terminal window.

```sh
# Please ensure you are in respository root
cd frontend
```

```sh
# pnpm can be replaced with any node package manager e.g. yarn, npm
pnpm install
```

```sh
# create file for enironment variable injection for development
cp .env.example .env.local
```

```sh
pnpm dev
```

For more commands, please navigate to the corresponding component.

## How to use the application

Refer to the [User Documentation](./doc/)
