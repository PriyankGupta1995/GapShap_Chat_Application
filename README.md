# GapShap

A Real Time Chat Application built using Node.js, Express, Mongoose and Socket.io.

## Index
+ [Features](#features)
+ [Functionality](#features)
+ [Installation](#installation)
+ [Structure](#Structure)

## Features<a name="features"></a>
+ Uses Express as the application Framework.
+ Manages Sessions using [express-session](https://github.com/expressjs/session) package.
+ Passwords are hashed using [bcrypt-nodejs](https://github.com/shaneGirish/bcrypt-nodejs) package.
+ Real-time communication between a client and a server using [Socket.io](https://github.com/socketio/socket.io).
+ Uses [MongoDB](https://github.com/mongodb/mongo), [Mongoose](https://github.com/Automattic/mongoose) for storing and querying data.
+ Uses [JWT](https://jwt.io/) for authentication and stores the token in a cookie.

## Functionality<a name="features"></a>
+ Allows users to register and login to the chat application.
+ Allows users to initiate new chats with a user/chatroom.
+ Allows users to update their profile and view the profile of other users.
+ Stores user connections to allow users to connect back with previously connected users.

## Installation<a name="installation"></a>
### Running Locally

1. Install NodeJS and MongoDB and have MongoDB running.

2. Clone or Download the repository

	```
	$ git clone https://github.com/PriyankGupta1995/GapShap_Chat_Application
	$ cd gapshap
	```
3. Install Dependencies

	```
	$ npm install
	```
4. Add configuration for key 'jwtPrivateKey'

        ```
	$ set gapShap_jwtPrivateKey=<secretKey> (Windows)
	$ export gapShap_jwtPrivateKey=<secretKey> (Mac, Linux)
	```
5. Start the application

	```
	$ npm start
	```
6. The app should now be running on [localhost:3000](http://localhost:3000/).

## Structure<a name="Structure"></a>

+ All app related components are present in app , public files(CSS, JS) stored in public directory and views(EJS) in views directory.
+ The routes have been placed in app/routes. They interact with managers to handle the client requests. 
+ Managers in turn rely upon Dao for database operations.
+ Utils directory contains utility functions for hashing , tokenizing.
+ Few middleware functions for authentication, error handling and incoming request validation.

+ There are two schemas; users and rooms. 

Each user has a username, password, emailId(unique),status,profile picture, profile status and user connections.
Each room has a title and user connections. 

### Reasoning 

+ Router layer is responsible for validating incoming requests (checking if required fields present in expected format) and using manager to 
handle the requests. 
+ Manager layer is where the core business logic lies and is responsible to handle(manage) the incoming requests by delegating tasks to utils or underlying Dao layer.
+ Dao layer has the sole authority of the data models and performing CRUD operations on the database.
+ Utils class are just helper classes and can be used across layers as required.
+ Having this kind of seperation between layers allows flexibility and modularization of the application. If in the future, a data migration to another database is 
planned, only the DAO layer would be affected. Same is true for utils.Eg:- If a different hashing algorithm is required for all fields.
+ In a real world scenario, I would have also preferred having seperate business objects to be used in manager layer and have transformers in between while passing it to the DB 
. But since only user and room models were required, I thought to avoid unncessary overload.


 
