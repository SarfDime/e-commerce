<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="200" alt="Nest Logo" /></a>
</p>

[circleci-image]: https://img.shields.io/circleci/build/github/nestjs/nest/master?token=abc123def456
[circleci-url]: https://circleci.com/gh/nestjs/nest

  <p align="center">A <a href="http://nodejs.org" target="_blank">Nest.js</a> Prisma.js api for E-Commerce interview assignment.</p>
    <p align="center">

## Installation

```bash
# install dependencies
$ npm install
# run if needed
$ npx prisma generate
```

## Running the app

- Premade Postman collection located in root directory, demoes all CRUD operations.
- REPLACE Database info in .env file remove <> eg. ```<DBUsername>``` should be johndoe

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
