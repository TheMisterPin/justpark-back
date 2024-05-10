# JustPark Backend

This repository hosts the back-end services for a comprehensive Parking Management System designed to streamline the operations of parking lots. Developed using Node.js, Express, MySQL, TypeScript, and Prisma ORM, this system currently supports basic CRUD operations for managing parking data.
This is the back-end counerpart for [JustPark](https://github.com/TheMisterPin/justpark-front)
## Features

Currently, the system includes the following features:
- **Create, Read, Update, Delete (CRUD) Operations:** Manage parking spaces effectively through a robust backend.

### Planned Features
- **Role-Based Access Control (RBAC):** Distinct roles for parking owners, wardens, and users.
- **User Features:**
  - Park and pay via the app.
  - Search for available parking spots.
- **Owner Features:**
  - Create and manage parking lots.
  - Invite and manage wardens.

## Getting Started

These instructions will get you a copy of the project up and running on your local machine for development and testing purposes.

### Prerequisites

What things you need to install the software and how to install them:

Node.js
Express
MySQL
TypeScript
Prisma

arduino
Copy code

### Installing

A step by step series of examples that tell you how to get a development env running:

1. Clone the repo:
   ```bash
   git clone https://github.com/TheMisterPin/justpark-back/
   ```
Install NPM packages:
```bash
npm install
```
Setup the .env file following the .env.example

Setup your MySQL database and modify the Prisma configuration as needed.
Run the development server:

```bash
npx prisma generate
npm start
```


### Authors
Michele Pin - Initial work - [TheMisterPin](https://github.com/TheMisterPin)
### License
This project is licensed under the MIT License.


### Updates
v0.1
Initial release with basic CRUD operations for parking management.
