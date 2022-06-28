## Description

[NestJS: The Complete Developer's Guide](https://www.udemy.com/course/nestjs-the-complete-developers-guide/) course accompaniment project. Section 6

## Task

````bash
# Create a new project
nest new di

# Create modules
nest g mo computer
nest g mo cpu
nest g mo disk
nest g mo power

# Create services
nest g s cpu
nest g s power
nest g s disk

# Create a controller
nest g co computer
```


## Installation

```bash
$ npm install
````

## Running the app

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Test

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```
