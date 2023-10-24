# Whiteboard server

Backend for our whiteboard.

## Project setup with docker

To build and run the server simply execute

```sh
docker compose up
```

or to run in background

```sh
docker compose up -d
```

Then you can stop the containers with

```sh
docker compose stop
```

## Running checks

When using docker this should be done inside the container.

### Type check

To perform only type checking you can run:
```sh
npm run type-check
```

### Lint with [ESLint](https://eslint.org/)

To validate:
```sh
npm run lint-check
```

To run lint and fix:
```sh
npm run lint
```

### Format

To format:
```sh
npm run format
```

To check formating:
```sh
npm run format-check
```

Please run format, lint and type checks before each commit.

## Manual project setup

### Setup database

First you need to install `redis` on your device with your system's package menager.
Then simply run:

```sh
redis-server --port 9000 --daemonize yes
```

### Install node dependencies

```sh
npm ci
```

### Run with Hot-Reloads for Development

```sh
npm run dev
```

### Type-Check, Compile and Minify for Production

```sh
npm run build
```


