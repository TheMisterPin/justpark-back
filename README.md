# JustPark Backend

This repository hosts the back-end services for a comprehensive Parking Management System designed to streamline the operations of parking lots. Developed using Node.js, Express, MySQL, TypeScript, and Prisma ORM, this system currently supports basic CRUD operations for managing parking data.
This is the back-end counerpart for [JustPark](https://github.com/TheMisterPin/justpark-front)




## 🌟 Features
Authentication System: Secure user authentication with password encryption and JWT tokens.
Role-Based Access Control (RBAC): Three roles - Owner, Warden, Customer.
Owner: Create and manage parking spots, assign wardens, and check occupancy.
Warden: Monitor cars in assigned parking spots.
Customer: Register cars and pay for parking (Payment feature not included in MVP).
Middleware: Role and token validation.
Parking Types: On-street, covered, guarded, electric car charging, subscription options.
Parking Management: Manage wardens, set opening times, monitor earnings, and more.

## 📖 Documentation and Live Website
The full API documentation can be found [here](https://justpark-back.vercel.app/).


## 📬 Postman Collection
You can access the Postman collection for testing the API [here](https://api.postman.com/collections/30920715-a929674b-f78a-49cc-8baf-22255a87205a?access_key=PMAT-01HXSXC2QPTZGDWYPMXA97KD4G).

## 🔧 Installation and Setup
Clone the repository:

```bash
git clone https://github.com/yourusername/parking-app-backend.git
```
Install dependencies:

```bash
cd parking-app-backend
npm install
```

- Set up environment variables:
Create a .env file in the root directory and copy the content of .env.example.
```env
DATABASE_URL='mysql://username:password@localhost:3306/database'
PORT= 8080
JWT_SECRET='generate a random secret'
```

- Run migrations:
```bash
npx prisma migrate dev
```
Start the server:

```bash
npm run dev
```
## 🤝 Contributing
We welcome contributions! Please read our contributing guidelines to get started.

### Authors
Michele Pin - Initial work - [TheMisterPin](https://github.com/TheMisterPin)
### License
This project is licensed under the MIT License.


### Updates
v0.1
Initial release with basic CRUD operations for parking management.


### Updates
v0.1
Initial release with basic CRUD operations for parking management.
