'use strict';

// Dependencies
const express = require('express');
const session = require('express-session');
const bodyParser = require('body-parser');
const path = require('path');
const flash = require('connect-flash');
const Mongoose = require('mongoose');
const config = require('config');
const cookieParser = require('cookie-parser');

const homeRouter = require('./app/router/login');
const userRouter = require('./app/router/user');
const roomRouter = require('./app/router/room');

if(!config.get('jwtPrivateKey')) {
    process.exit(1);
}

const app = express();

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

Mongoose.connect('mongodb://localhost/gapshap',{ useNewUrlParser: true , useCreateIndex: true })
    .then(result => console.log("Connected to mongoose"))
    .catch(error => console.log("Did not connect to Mongoose"));

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use('/user', userRouter);
app.use('/rooms', roomRouter);
app.use('/', homeRouter);

// Middleware to catch 404 errors
app.use(function(request, response, next) {
    response.status(404).render('error', {error: 'ResourceNotFound'});
});

const port = process.env.PORT || 3000;

app.listen(port);

