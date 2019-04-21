'use strict';

const express = require('express');
const app = express();

const session = require('express-session');
const bodyParser = require('body-parser');
const path = require('path');
const flash = require('connect-flash');
const cookieParser = require('cookie-parser');
const server = require(path.resolve( __dirname, "./app-startup.js" ))(app);

const homeRouter = require('./app/router/login');
const userRouter = require('./app/router/user');
const roomRouter = require('./app/router/room');
const errorHandler = require('./app/middleware/error-handler');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static('public'));
app.use(cookieParser());

app.use(session({
    secret: 'secret',
    resave: false,
    saveUninitialized: false
}));
app.use(flash());

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use('/user', userRouter);
app.use('/rooms', roomRouter);
app.use('/', homeRouter);

// Middleware to catch 404 errors
app.use(function(request, response, next) {
    response.status(404).render('error', {error: 'ResourceNotFound'});
});

app.use(errorHandler);

const port = process.env.PORT || 3000;

server.listen(port);

