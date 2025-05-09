<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="120" alt="Nest Logo" /></a>
</p>

# NestJS CRUD App with Auth & Docker


## Installation

### Clone the Repository

Clone the repository to your local machine:

```bash
git clone https://github.com/SDE-Arun/NestJs_Project.git
cd NestJs_Project
```

### Install Dependencies

Install all required dependencies using **Yarn**:

```bash
yarn install
```

### Running the Project with Docker

To run both the NestJS application and Prism DB with Docker, use:

```bash
docker-compose up --build -d
```

This will start:

- A **PostgreSQL** container.
- The **NestJS** application.

## Compile and Run the Project {without Docker}

To start the project in different modes, use the following commands:

### Development Mode

```bash
$ yarn run start
```

### Watch Mode

```bash
$ yarn run start:dev
```

## Run Tests

You can run the following tests using Yarn:

### Unit Tests

```bash
$ yarn run test
```

### E2E Tests

```bash
$ yarn run test:e2e
```

### Test Coverage

```bash
$ yarn run test:cov
```

## Deployment

When you're ready to deploy your NestJS application to production, follow the deployment documentation for more information.

If you're looking for a cloud-based platform to deploy your NestJS application, check out [Mau](https://mau.nestjs.com), which simplifies deployment on AWS.

To deploy using Mau, follow these steps:

```bash
$ yarn install -g mau
$ mau deploy
```

Mau allows for easy deployment, helping you focus more on building features rather than managing infrastructure.

---

## Project Overview

This is a **NestJS** project that implements a **CRUD (Create, Read, Update, Delete)** functionality using **PostgreSQL** as the database. The project also includes **authentication** features using JWT (JSON Web Tokens), and it’s containerized using **Docker** for easy setup and deployment.

## Features

- **CRUD Operations**: Perform create, read, update, and delete operations on a PostgreSQL database.
- **Authentication**: Secure user authentication using JWT (JSON Web Tokens).
- **Dockerized**: The application and PostgreSQL are containerized using Docker.

## Tech Stack

- **NestJS**: A framework for building scalable server-side applications.
- **PostgreSQL**: A relational database management system.
- **TypeORM**: ORM for working with databases in TypeScript.
- **JWT**: Authentication using JSON Web Tokens.
- **Docker**: Containerization for easier development and deployment.

## Support

Nest is an MIT-licensed open source project. It grows with support from the community. If you'd like to support the project, please visit [here](https://docs.nestjs.com/support).

## Stay in Touch

- **Author**: Arun Chaudhary
- **Email**: clarun2511@gmail.com

## License

This project is licensed under the [MIT License](https://github.com/nestjs/nest/blob/master/LICENSE).

