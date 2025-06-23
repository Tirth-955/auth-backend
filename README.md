# MERN-AUTH Backend

This is the backend for the MERN-AUTH project, providing user authentication functionalities.

## Features

- User Registration
- User Login
- User Logout
- Email Verification with OTP
- User Data Retrieval (authenticated)

## Technologies Used

- Node.js
- Express.js
- MongoDB (with Mongoose)
- JWT (JSON Web Tokens) for authentication
- bcryptjs for password hashing
- nodemailer for email sending
- cookie-parser for parsing cookies
- cors for handling Cross-Origin Resource Sharing

## Setup and Installation

1.  **Clone the repository:**
    ```bash
    git clone <repository_url>
    cd mern-auth/backend
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```

3.  **Create a `.env` file:**
    In the `backend` directory, create a `.env` file and add the following environment variables:

    ```env
    PORT=4000
    MONGO_URI=your_mongodb_connection_string
    JWT_SECRET=your_jwt_secret_key
    SENDER_EMAIL=your_email@example.com
    SENDER_PASSWORD=your_email_password # App password for Gmail or similar
    NODE_ENV=development # or production
    ```
    *   Replace `your_mongodb_connection_string` with your MongoDB connection URI.
    *   Replace `your_jwt_secret_key` with a strong, random string.
    *   Set `SENDER_EMAIL` and `SENDER_PASSWORD` for Nodemailer (e.g., if using Gmail, you'll need an App Password).

4.  **Run the backend server:**
    ```bash
    npm start
    ```
    The server will run on the specified `PORT` (default: 4000).

## API Endpoints

All API endpoints are prefixed with `/api/auth`.

### User Authentication

-   **`POST /api/auth/register`**
    *   **Description**: Register a new user.
    *   **Request Body**:
        ```json
        {
            "name": "User Name",
            "email": "user@example.com",
            "password": "password123"
        }
        ```
    *   **Response**:
        ```json
        {
            "success": true,
            "message": "User Registered Successfully."
        }
        ```

-   **`POST /api/auth/login`**
    *   **Description**: Log in an existing user. Sets a JWT token in cookies.
    *   **Request Body**:
        ```json
        {
            "email": "user@example.com",
            "password": "password123"
        }
        ```
    *   **Response**:
        ```json
        {
            "success": true,
            "message": "Logged In Successfully."
        }
        ```

-   **`POST /api/auth/logout`**
    *   **Description**: Log out the current user. Clears the JWT token cookie.
    *   **Authentication**: Required (JWT token in cookie).
    *   **Request Body**: None
    *   **Response**:
        ```json
        {
            "success": true,
            "message": "Logged Out Successfully."
        }
        ```

### Email Verification

-   **`POST /api/auth/send-verify-otp`**
    *   **Description**: Sends an OTP to the authenticated user's email for account verification.
    *   **Authentication**: Required (JWT token in cookie).
    *   **Request Body**: None (userId is extracted from token)
    *   **Response**:
        ```json
        {
            "success": true,
            "message": "Verification OTP Sent On Email."
        }
        ```

-   **`POST /api/auth/verify-account`**
    *   **Description**: Verifies the user's account using the received OTP.
    *   **Authentication**: Required (JWT token in cookie).
    *   **Request Body**:
        ```json
        {
            "otp": "123456"
        }
        ```
    *   **Response**:
        ```json
        {
            "success": true,
            "message": "Email Verified Successfully."
        }
        ```

### User Data

-   **`GET /api/auth/get-user-data`**
    *   **Description**: Retrieves the authenticated user's data.
    *   **Authentication**: Required (JWT token in cookie).
    *   **Request Body**: None (userId is extracted from token)
    *   **Response**:
        ```json
        {
            "success": true,
            "userData": {
                "name": "User Name",
                "isAccountVerified": true
            }
        }
        ``` 