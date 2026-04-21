<h3 align="center">WEBSHOP [ReactJS + Express(NodeJS) + Sequalize(PostgreSQL)]</h3>

## Quick links

- [About](#about)
- [Getting Started](#getting_started)
- [Usage](#usage)
- [Tech Stack](#techstack)
- [Tests](#tests)
- [Screenshots](https://github.com/alexromlex/NODE_REACT_webshop/tree/main/screenshots)

## About <a name = "about"></a>

This project was published only for code demonstrating. It has limited e-commerce functionality of following features.

| User                   | Admin                       |
| ---------------------- | --------------------------- |
| - Registration / login | - Dashboard with statistics |
| - Product Items        | - Orders                    |
| - Basket management    | - Users                     |
| - Checkout process     | - Products                  |
| - My Orders            | - Product types             |
|                        | - Brands                    |
|                        | - Settings                  |

## Getting Started <a name = "getting_started"></a>

These instructions will get you a copy of the project up and running on your local machine for development and testing purposes.

### Installing

Firstly [download](https://github.com/alexromlex/NODE_REACT_webshop/archive/refs/heads/main.zip) and unpack files to local storage.

Install node_modules inside \server> and \client> directories:

```
cd server && npm install
cd ..
cd client && npm install
```

Run [docker desktop](https://www.docker.com/products/docker-desktop/)

Then, run all containers with enviroments by command from project root dicrectory:

```
docker compose --env-file .env up -d
```
Database syncronization and User admin will create automaticaly.
init-db.sh -> src/database/seed-db.ts will install npx and run script to seed data.

Alternative way:
Go to URL: http://localhost:5026/api/system/db_sync

### result should be the next:

- DB Authorisation was successfully!
- DB has been Synchronized!
- NEW - SETTINGS created!
- NEW - User(ADMIN) created!

## Usage <a name="usage"></a>

Firstly login as ADMIN by URL: http://localhost:5226/login

ADMIN email & password you can find inside .env file

Then, navigate to admin panel http://localhost:5226/admin/brands where you can create a brands!

After this, create product types, that will contain the brands you have already created.

If you have created types and brands, let's crate a products!

## Tech Stack <a name = "techstack"></a>

## Backend

- NodeJS v.22
- Express v.4
- Loging - Morgan
- Authentication (JWT Bearer)
- OpenAPI Swagger
- Test metadata generator(TestPlan)
- TypeScrypt

## Database

- PostgreSQL v.16
- Sequalize ORM
- pgadmin v.4 (included)

## Frontend

- REACTJS
- HighCharts
- TinyMCE
- TypeScrypt

## Tests

- Jest
- Supertest
- TypeScrypt

## 🔧 Running the tests <a name = "tests"></a>

To start tests, run CMD in \server> directory :

```
 npm run test
```

Tests written only for API router with 100% coverage:

![Docker desktop](./screenshots/test_coverage.png)
