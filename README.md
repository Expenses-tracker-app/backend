# Expense Tracker Backend

A backend service for the Expense Tracker web application, built with Node.js and PostgreSQL.

## Features

- CRUD operations for Expenses, Incomes, Users, and Tags.
- User authentication and authorization using JSON Web Tokens (JWT).
- Secure password hashing using bcryptjs.
- PostgreSQL database connection using the `pg` Node.js module.

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/)
- [PostgreSQL](https://www.postgresql.org/)

### Installation

1. Clone the repository:

```
git clone https://github.com/Expenses-tracker-app/backend.git
cd backend
```

2. Install the dependencies:

```
npm install
```

3. Set up your PostgreSQL database and update the `config/db.js` file with your database credentials.

4. Start the server:

```
node server.js
```

The server should now be running on the specified port (default is 3000).

## API Endpoints

### Expense
- `GET /expense`: Retrieves a list of all expenses for a user.
- `POST /expense/create`: Adds a new expense.
- `DELETE /expense/delete/:id`: Deletes a specific expense by ID.
- `PUT /expense/update/:id`: Updates a specific expense by ID.

### Income
- `GET /income`: Retrieves a list of all incomes for a user for the default duration (per month). It also allows users to specify a time period (day/month/year) for which they want to fetch the incomes.
- `POST /income/create`: Adds a new income entry. The `income_id` is generated automatically.
- `DELETE /income/delete/:id`: Deletes a specific income entry by its

`income_id`.
- `PUT /income/update/:id`: Updates details of a specific income entry by its `income_id`.

### User
- `GET /user/:id`: Retrieves user profile details using the provided `user_id` in the parameters. Returns the username, email, and a hashed password (for security reasons, consider not sending the hashed password to the frontend).
- `POST /user/create`: Registers a new user. The `user_id` is generated automatically.
- `DELETE /user/delete/:id`: Deletes a user profile using the provided `user_id` in the parameters.
- `PUT /user/update/:id`: Updates user profile details (such as username and password) using the provided `user_id` in the parameters.

### Tag
- `GET /tag`: Retrieves a list of all tags for the tags page. Users can edit a tag directly from this list.
- `POST /tag/create`: Adds a new tag. The `tag_id` is generated automatically.
- `DELETE /tag/delete/:id`: Deletes a specific tag using the provided `tag_id` in the parameters.
- `PUT /tag/update/:id`: Updates the name of a specific tag using the provided `tag_id` in the parameters.


## Security

- Passwords are hashed using bcryptjs before storing in the database.
- JWT is used for user authentication and authorization.
- Always ensure to keep your database credentials and JWT secret key secure.


## License

This project is licensed under the MIT License.