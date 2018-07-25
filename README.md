# koa boilerplate

A Simple koa Boiler plate app with JWT authentication.

it contains

- koa router
- mongoose
- body parser
- logger
- pre-baked simple JWT authentication

### Installation

- requires node 7.6+ (since it uses async/await)
- clone the repo
- cd in repo
- run `cp env.example .env`
- you can pass global variables in .env file
- run `npm start`
- app will be avalable on port 3000 or whatever port u have sepecfied in ur `.env` file

### File Structure

- new routes can be defined in `app/routes.js` files
- protected routes can use `privateRouter` and public can use `publicRouter`
- middleware can be declared in `app/middleware.js`

### pre baked routes

- `GET` /api/

  - public sample route
  - response : `{'message':'Hello World!'}`

- `GET` /api/private

  - public sample authenticated route
  - response : `{'message':'private'}`

- `POST` /api/users :
  - this will create new a user
  - params : `{username:'',password:''}`
  - response : `{username:'',password:'',token:''}`
- `POST` /api/login :
  - this will return JWT token for an existing user
  - params : `{username:'',password:''}`
  - response : `{username:'',password:'',token:''}`

### Static Folder

- files served in `./public` will be accessible publicly
