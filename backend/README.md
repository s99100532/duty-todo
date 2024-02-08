# Backend

## Tech Stack

- ExpressJs for web server
- Zod for data validation

## Getting Started

```sh
# pnpm can be repalce any js package manager e.g. npm, yarn
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

## Test the application

1. Start the postgres database for testing. (Use [this](./docker-compose.yaml) if docker installed)
2. update `.env.test` for the testing database
3. Run `pnpm test`.
   ![image](./test.png)

## Start for production

1. Create `.env.production` in this project root (Not recommend) or inject the required environment variables.

2. Run `pnpm start:prod`
