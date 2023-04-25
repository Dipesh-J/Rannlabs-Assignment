# Rannlabs-Assignment

## Table of Contents

- [Installation_&_Usage](#installation&usage)
- [Tech-Stacks-Used](#Tech-Stacks-Used)

## Installation & Usage

1. Clone the repository:

    git clone https://github.com/Dipesh-J/Rannlabs-Assignment.git


2. Install the dependencies:

    cd Rannlabs-Assignment
    npm install


3. Setup these environment variables:
    - PORT
    - MONGO_CONNECTION_STRING
    - SECRET_KEY

__Note__:- .env file is already included for testing purposes, so setting the environment variables is completely optional.


4. Start the server:

    npm start


5. Use a tool like Postman to test the API's



## Tech-Stacks-Used

This is the list of all the teck stack and depenedencies used:-
- `aws-sdk`: AWS SDK for Node.js which provides APIs for storage services like S3.
- `bcrypt`: A library to hash and compare passwords for secure storage and authentication.
- `dotenv`: A zero-dependency module that loads environment variables from a .env file into process.env.
- `express`: A fast, unopinionated, minimalist web framework for Node.js used for building web applications and APIs.
- `joi`: A validator library used for data validation and schema definition for Node.js.
- `jsonwebtoken`: A library for generating and verifying JSON Web Tokens (JWT) used for authentication and authorization.
- `mongoose`: An object data modeling (ODM) library used to interact with MongoDB databases in Node.js applications.
- `multer`: A middleware for handling `multipart/form-data`, which is primarily used for uploading files in Node.js applications.
- `nodemon`: A utility that monitors changes in the source code and automatically restarts the server.

