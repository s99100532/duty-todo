# Backend

## Tech Stack
- ExpressJs for web server
- Zod for data validation


## Getting Started
```sh
# pnpm can be repalce any js package manager e.g. npm, yarn 
pnpm install
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