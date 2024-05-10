<h3 align="center">WEBSHOP [ReactJS + Express(NodeJS) + Sequalize(PostgreSQL)]</h3>

## 📝 Quick links

- [About](#about)
- [Getting Started](#getting_started)
- [Deployment](#deployment)
- [Usage](#usage)
- [Built Using](#built_using)
- [TODO](#todo)
- [Contributing](../CONTRIBUTING.md)
- [Authors](#authors)
- [Acknowledgments](#acknowledgement)

## 🧐 About <a name = "about"></a>

This is project was created only for code demonstrating. It has a very limited e-commerce futures.

| User                   | Admin                       |
| ---------------------- | --------------------------- |
| - Registration / login | - Dashboard with statistics |
| - Product Items        | - Orders                    |
| - Basket management    | - Users                     |
| - Checkout process     | - Products                  |
|                        | - Product types             |
|                        | - Brands                    |
|                        | - Settings                  |

## 🏁 Getting Started <a name = "getting_started"></a>

These instructions will get you a copy of the project up and running on your local machine for development and testing purposes.

### Installing

Download and unpack files to locale storage.

Install node_modules inside \server> and \client> directories:

```
npm install
```

Run docker [desktop app](https://www.docker.com/products/docker-desktop/)

Then run containers with command from project root dicrectory:

```
docker compose up -d
```

I recommend create database by API, but before waiting for container <webshop_db> is started successfully, see docker desktop app!

<webshop_db> container logs, itt must be like:

```
LOG: database system is ready to accept connections
```

Also you'll see db files inside project root directory \db>

Then, go to URL: [localhost:5026/api/system/db_sync](http://localhost:5026/api/system/db_sync)

itt will run:

- db authentication
- create DB tables
- create admin user
- create default settings

## 🎈 Usage <a name="usage"></a>

Firstly login as ADMIN by URL: http://localhost:5226/login

ADMIN email & password you can find in root directory .env file

Then go to admin panel http://localhost:5226/admin/brands where you can create a brands!

After this, create product types, whitch will contain already created brands.

When you have types and brands, let's crate a products!

## 🚀 Deployment <a name = "deployment"></a>

## Backend

- NodeJS v.18
- Express v.4
- Logign - Morgan
- Authentication (JWT + bcrypt)
- TypeScrypt

## Database

- Sequalize v.6 ORM
- PostgreSQL v.16
- pgadmin v.4 (included)

## Frontend

- ReactJS
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

Tests written for API router with 100% coverage:

![Docker desktop](./screenshots/test_coverage.png)
