<<<<<<< HEAD

=======
# E-Commerce App Backend API

## 📚 Project Overview
The **E-Commerce-App-Backend-Api** is a RESTful API for an e-commerce application, built with **Node.js**, **Express.js**, and **MongoDB**. It provides essential functionalities for user authentication, product management, cart operations, order processing, and QR code-based payment.

## 🚀 Features
- **User Authentication & Authorization**
  - Register, login, and refresh tokens
  - Role management: Admin, User
- **Product Management**
  - Add, update, and delete products
  - Upload product images
- **Cart Management**
  - Add/remove products to/from cart
  - Update product quantities
- **Order Management**
  - Create orders
  - Track order status: Pending, Confirmed, Shipped
- **Payment Integration**
  - QR code-based payment simulation
- **User Profile**
  - Manage personal information
  - View order history
- **Security**
  - JWT for authentication
  - bcrypt for password hashing

## 🛠️ Technologies Used
- **Backend:** Node.js, Express.js
- **Database:** MongoDB, Mongoose
- **Authentication:** JWT, bcrypt
- **Payment Integration:** QR code
- **Template Engine:** Handlebars (for admin views if applicable)
- **Architecture:** MVC (Model-View-Controller)
- **Environment Variables:** dotenv
- **API Testing:** Postman
- **Version Control:** Git, GitHub

## 🔧 Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/dacbinh123/E-Commerce-App-Backend-Api.git
   ```

2. **Navigate to the project directory:**
   ```bash
   cd E-Commerce-App-Backend-Api
   ```

3. **Install dependencies:**
   ```bash
   npm install
   ```

4. **Set up environment variables:**
   - Create a `.env` file in the root directory
   - Add the following variables:
   ```plaintext
   PORT=3000
   MONGO_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret
   ```

5. **Start the server:**
   ```bash
   npm start
   ```

The API will run at `http://localhost:3000`

## 📡 API Endpoints

### Authentication
- **POST** `/api/auth/register` — Register a new user
- **POST** `/api/auth/login` — Login and get JWT token

### Products
- **GET** `/api/products` — Get all products
- **POST** `/api/products` — Add a new product (Admin only)
- **PUT** `/api/products/:id` — Update a product (Admin only)
- **DELETE** `/api/products/:id` — Delete a product (Admin only)

### Cart
- **POST** `/api/cart` — Add product to cart
- **GET** `/api/cart` — Get user's cart
- **DELETE** `/api/cart/:id` — Remove product from cart

### Orders
- **POST** `/api/orders` — Create a new order
- **GET** `/api/orders` — Get all orders (Admin only)
- **GET** `/api/orders/:id` — Get order details

## 🧪 Testing
You can test the API using **Postman**:
1. Import the API routes into Postman.
2. Set the `Authorization` header to `Bearer <your_token>` for protected routes.

## ✨ Contribution
Contributions are welcome! If you want to improve the project, please fork the repository and submit a pull request.

## 📄 License
This project is licensed under the MIT License.

---

**Author:** [dacbinh123](https://github.com/dacbinh123)

Feel free to suggest any enhancements or report bugs by opening an issue! 🚀
>>>>>>> 9986e10 (readme)
