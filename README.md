# JustPark Backend

This repository hosts the back-end services for a comprehensive Parking Management System designed to streamline the operations of parking lots. Developed using Node.js, Express, MySQL, TypeScript, and Prisma ORM, this system currently supports basic CRUD operations for managing parking data. This is the back-end counterpart for JustPark.

## 🌟 Features

- **Authentication System:** Secure user authentication with password encryption and JWT tokens.
- **Role-Based Access Control (RBAC):** Three roles - Owner, Warden, Customer.
  - **Owner:** Create and manage parking spots, assign wardens, and check occupancy.
  - **Warden:** Monitor cars in assigned parking spots.
  - **Customer:** Register cars and pay for parking (Payment feature not included in MVP).
- **Middleware:** Role and token validation.
- **Parking Types:** On-street, covered, guarded, electric car charging, subscription options.
- **Parking Management:** Manage wardens, set opening times, monitor earnings, and more.

## 📖 Documentation and Live Website

The full API documentation can be found here.

## 📬 Postman Collection

You can access the Postman collection for testing the API here.

## 🔧 Installation and Setup

Clone the repository:

```sh
git clone https://github.com/TheMisterPin/justpark-back.git

```
Install dependencies:
```sh

cd parking-app-backend
npm install
```
Set up environment variables: Create a .env file in the root directory and copy the content of .env.example.

```env
DATABASE_URL='mysql://username:password@localhost:3306/database'
PORT=8080
JWT_SECRET='generate a random secret'
```

Run migrations:

```bash
npx prisma migrate dev
```
Start the server:
```bash
npm run dev
```
## 🤝 Contributing
We welcome contributions! Please read our contributing guidelines to get started.


## Authors
Michele Pin - Initial work - TheMisterPin
License
This project is licensed under the MIT License.

## Updates
- v0.1
Initial release with basic CRUD operations for parking management.

- v1.0
Added parking controllers, users controllers, secured login.
Added middleware for token check.

- v1.1
Implemented CRUD operations for parking sessions with Prisma.
Updated parking, car, and warden controllers.
Established robust router configurations.
Fine-tuned error handling across controllers.

- v1.2
Created detailed API documentation.
Added endpoints for Authentication, Users, Parkings, Cars, Wardens, and Sessions.
Implemented user controller functionality.

- v1.3
Added role middleware for better RBAC.
Polished messages in controllers.
Implemented user credit management.

- v1.4
Implemented session token and password token for authentication.
Added nodemailer for sending emails.
Improved role and permission checks.
Added Docker support.

- v1.5
Added feature for retrieving coordinates from address using Google API.
Improved error handling in warden controller.
Preparing for front-end implementation.
