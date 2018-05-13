![Node](https://img.shields.io/badge/node-8.11.1-brightgreen.svg)
[![styled with prettier](https://img.shields.io/badge/styled_with-prettier-ff69b4.svg)](https://github.com/prettier/prettier)
[![CircleCI](https://img.shields.io/circleci/project/github/socialement-competents/backathon.svg)](https://circleci.com/gh/socialement-competents/backathon)
[![Code coverage with Codecov](https://img.shields.io/codecov/c/github/socialement-competents/backathon.svg)](https://codecov.io/gh/socialement-competents/backathon)
![No license](https://img.shields.io/github/license/socialement-competents/backathon.svg)
[![Docker](https://img.shields.io/docker/pulls/socialementcompetents/backathon.svg)](https://hub.docker.com/r/socialementcompetents/backathon/)

This repo is functionality complete — PRs and issues welcome!

# Getting started

To get the Node server running locally:

- Clone this repo
- `npm install` to install all required dependencies
- `npm run prettier` to have a beautiful codebase
- `npm run test` to launch ITs
- `docker-compose up` to launch docker stack
- Install MongoDB Community Edition ([instructions](https://docs.mongodb.com/manual/installation/#tutorials)) and run it by executing `mongod`
- `cp .env.example .env` to have access to environement variables (dont forget to change them)
- `npm run start` or `yarn start` to start the local server
- `npm run build` or `yarn build` to build the server

# Workflow

- `git checkout master`
- `git fetch`
- `git pull`
- `git branch -b '(feat|fix|refacto)/branch_name` pull out a branch from master (up to date)
- dev your stuff
- `git add .`
- `git commit -m 'Your commit'`
- `git push origin (feat|fix|refacto)/branch_name`
- create a pull request to run checks (conflicts, CI)
- ask for a review
- squash and merge
- check master tests

# Code Overview

## Dependencies

- [expressjs](https://github.com/expressjs/express) - The server for handling and routing HTTP requests
- [express-jwt](https://github.com/auth0/express-jwt) - Middleware for validating JWTs for authentication
- [jsonwebtoken](https://github.com/auth0/node-jsonwebtoken) - For generating JWTs used by authentication
- [mongoose](https://github.com/Automattic/mongoose) - For modeling and mapping MongoDB data to javascript 
- [mongoose-unique-validator](https://github.com/blakehaswell/mongoose-unique-validator) - For handling unique validation errors in Mongoose. Mongoose only handles validation at the document level, so a unique index across a collection will throw an exception at the driver level. The `mongoose-unique-validator` plugin helps us by formatting the error like a normal mongoose `ValidationError`.
- [passport](https://github.com/jaredhanson/passport) - For handling user authentication

## Application Structure

- `server.ts` - The entry point to our application. This file defines our express server and connects it to MongoDB using mongoose. It also requires the routes and models we'll be using in the application.
- `.env` - This folder contains configuration/environment variables (Dont forget to set it up)
- `routes/` - This folder contains the route definitions for our classic API.
- `graphql/` - This folder contains the graphql types, queries, mutations ...
- `models/` - This folder contains the schema definitions for our Mongoose models.

## Authentication !

Requests are authenticated using the `Authorization` header with a valid JWT. We define two express middlewares in `routes/auth.js` that can be used to authenticate requests. The `required` middleware configures the `express-jwt` middleware using our application's secret and will return a 401 status code if the request cannot be authenticated. The payload of the JWT can then be accessed from `req.payload` in the endpoint. The `optional` middleware configures the `express-jwt` in the same way as `required`, but will *not* return a 401 status code if the request cannot be authenticated.
