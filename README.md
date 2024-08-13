<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="200" alt="Nest Logo" /></a>
</p>

# UrbanAura NestJS API

✨ **UrbanAura API** is the backend service for the UrbanAura luxury fashion eCommerce platform. This API handles secure authentication, payment processing, search functionality, and more. It's built with **NestJS** and follows clean architecture principles for scalability and maintainability.

## 🎨 Features

- **Secure Authentication**: Supports both **Google Sign-In** 🛡️ and traditional **Email/Password** 🔑 methods with **Firebase**.
- **Seamless Payment Processing**: Integrated with **Stripe** 💳 for secure and reliable transactions.
- **Advanced Search**: Powered by **Algolia** 🔍 for fast and accurate product search.
- **Password Security**: Utilizes **Argon2** 🛠️ for password hashing.
- **RESTful API Design**: Provides a robust and consistent interface for client applications.
- **Scalable and Maintainable**: Built with **NestJS**, following **Clean Architecture** principles.
- **Database Management**: Uses **Prisma** as an ORM with **MongoDB** for efficient data handling.

## 🛠️ Technologies Used

- **NestJS**: A progressive Node.js framework for building efficient, reliable, and scalable server-side applications.
- **TypeScript**: A strongly typed programming language that builds on JavaScript, providing better tooling at any scale.
- **Stripe**: Payment gateway integration for handling transactions.
- **Algolia**: Search engine integration for fast and efficient search capabilities.
- **Firebase Admin**: For managing Google Sign-In and other Firebase-related functionalities.
- **Prisma**: ORM for managing MongoDb with a modern, type-safe query builder.
- **Argon2**: Password hashing for secure authentication.

## Installation

```bash
$ npm install
```
## Set up environment variables 
DATABASE_URL=your_database_url
STRIPE_SECRET_KEY=your_stripe_secret_key
END_POINT_SECRET=your_stripe_webhook_secret
ALGOLIA_APPID=your_algolia_app_id
ALGOLIA_API_KEY=your_algolia_api_key
firebaseKey=your_firebase_service_account_key
STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key


## 🧩 Architecture

This project follows Clean Architecture principles. The code is structured into several modules:

Auth Module: Manages authentication and authorization.
Checkout Module: Handles payment processing and related operations.
Users Module: Manages user data and operations.
Products Module: Handles product data and operations.
Cart Module: Manages cart data and operations.
Order Module: Manages order data and operations.


## 🌐 API Documentation
The API documentation is provided via Swagger and is available at http://localhost:4000/api when running the development server.

## Running the app

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```
## 📬 Contact

For any inquiries or feedback, feel free to reach out via sameerkhatangalekar@gmail.com.

