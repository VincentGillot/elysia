# elysia

Monorepo to test the Elysia framework for API development in Bun.

Has a complete user managmement system with roles and cookie authentication and authorization.

## Main startup

Execute `bun install` in the root of the monorepo to install all dependencies.

## Startup for API

Create `.env.local` file with the following variables:

- MONGO_URL="mongodb+srv://{USER}:{PASSWORD}@{URL}/{DB_NAME}?retryWrites=true&w=majority"
- JWT_SECRET="{SOME_SECRET_STRING}"
- INITIAL_ADMIN_EMAIL="{SOME_INITIAL_USER_EMAIL}"
- INITIAL_ADMIN_PASSWORD="{SOME_INITIAL_USER_PASSWORD}" -> This will be hashed into MD5, and the result logged to the console for easy login.
- NODE_ENV="development"

Inside the API root, execute `bun dev` to run the API on port 3001. This will create the intial user on the DB if it does not exist.

Access the Swagger at `http://localhost:3001/api/swagger`

### Mailer

Since there is no mailer in this boilerplate, things like the validation tokens for validating new registered users are logged to the console for testing.

### Roles

All endpoints under _/users_ are only accessible for users with the role _ADMIN_

Endpoints related to the user's account are accessible only for authorized users. Operations will be done on that detected user.

## Startup for Front

Normal Nextjs startup procedure. Nothing needed here.
