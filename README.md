# 🐾 Pet Marketplace

**Pet Marketplace** is a full-stack application built on the MERN (MongoDB, Express.js, React, Node.js) stack that allows pet enthusiasts to browse, purchase, and sell pets in a secure and user-friendly environment. It offers a rich selection of features such as secure authentication, detailed pet listings, seller and buyer interactions, and integrated payment through Razorpay.

---

## Table of Contents
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Installation](#installation)
- [Environment Variables](#environment-variables)
- [Usage](#usage)
- [API Endpoints](#api-endpoints)
- [Contributing](#contributing)
- [License](#license)
- [Acknowledgements](#acknowledgements)

---

## 🚀 Features

### User Features
- **User Authentication**: Register and log in securely with JWT-based email/password authentication.
- **Browse Pets**: View a list of available pets with photos, pricing, age, breed, and location information.
- **Detailed Pet Page**: View comprehensive details about a pet, including user comments, ratings, and an option to contact the seller.
- **Add to Cart and Checkout**: Add pets to the cart and proceed with secure payment through Razorpay.
- **Order History**: View past orders and order details, enabling users to track their purchases.

### Seller Features
- **Seller Dashboard**: Allows users with a "Seller" role to list new pets for sale, manage their listings, and view pet statistics.
- **Comment and Reply System**: Enables sellers and buyers to communicate through comments on listings, with the ability to reply and engage with other users.

### Additional Features
- **Responsive Design**: The UI is fully responsive, providing an optimal experience on desktops, tablets, and mobile devices.
- **User Interactions**: Users can rate pets and engage in conversations, creating a lively marketplace community.
- **Payment Integration**: Razorpay is integrated to ensure secure and convenient payment processing.

---

## 🛠️ Tech Stack

### Frontend
- **React**: For creating a dynamic and interactive user interface.
- **CSS Modules**: Ensures modular, maintainable styling across components.
- **Bootstrap**: Provides responsive and modern UI components.
- **React Icons**: Supplies a wide array of icons to enhance the user experience.

### Backend
- **Node.js**: Runtime environment for executing server-side JavaScript.
- **Express.js**: Fast and minimal web framework for building RESTful APIs.
- **MongoDB**: NoSQL database for storing user profiles, pet listings, and orders.
- **JWT**: JSON Web Token used for secure user authentication and authorization.

### Payment Gateway
- **Razorpay**: Integrated for safe and efficient payment processing.

### Storage
- **MongoDB Atlas**: Hosted MongoDB database for storing persistent data like users, pets, and orders.

---

## 📦 Installation

### Prerequisites
- Node.js (version 14+)
- MongoDB (or MongoDB Atlas for a hosted solution)
- Razorpay Account (for payment integration)

### Steps

1. **Clone the repository**:
   ```bash
   git clone https://github.com/yourusername/pet-marketplace.git
   cd pet-marketplace
