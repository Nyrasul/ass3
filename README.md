## Setup

To get the project running locally, follow these steps:

1.  **Clone the repository:**

    ```bash
    git clone [https://github.com/Nyrasul/ass3.git](https://github.com/Nyrasul/ass3.git)
    cd ass3
    cd ecommerce-api
    ```

2.  **Install dependencies:**

    ```bash
    npm install
    ```

3.  **Set up environment variables:**

    *   Create a `.env` file in the root directory of `ecommerce-api`.
    *   Add the following environment variables to `.env` file:

        ```
        MONGO_URI=<your-mongodb-uri>
        JWT_SECRET=<your-secret-key>
        PORT=3000
        ```
        **Note:** Replace `<your-mongodb-uri>` with your actual MongoDB connection string and `<your-secret-key>` with a strong secret key for JWT.

4.  **Start the server:**

    ```bash
    npm start
    ```

5.  **Access the API:**

    The API will be accessible at `http://localhost:3000`.
6.  **Use insomnia**
   ![image](https://github.com/user-attachments/assets/a04aeb44-6967-4f39-8743-e5e81b1bcb50)
6.  **Deploy**
![image](https://github.com/user-attachments/assets/e09c16b5-ffd9-4b3e-b3b0-ce945232c50c)


## API Endpoints

The following endpoints are available for the API:

### Users

| Method | Endpoint             | Description                     |
| :----- | :------------------- | :------------------------------ |
| POST   | `/api/users/register` | Register a new user.            |
| POST   | `/api/users/login`    | Log in a user and get a JWT. |

### Products

| Method | Endpoint          | Description                   |
| :----- | :---------------- | :---------------------------- |
| POST   | `/api/products`    | Create a new product.         |
| GET    | `/api/products`    | Get all products (paginated). |
| PUT    | `/api/products/:id` | Update a product by ID.       |
| DELETE | `/api/products/:id` | Delete a product by ID.       |

### Orders

| Method | Endpoint        | Description           |
| :----- | :-------------- | :-------------------- |
| POST   | `/api/orders`   | Create a new order. |
|GET|	/api/orders/user/:userId|	Get all orders for a user.|
