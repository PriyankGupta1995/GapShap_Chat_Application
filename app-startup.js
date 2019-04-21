'use strict';

const Mongoose = require('mongoose');
const config = require('config');
const http = require('http');
const socket = require('socket.io');

function init(app) {

    if(!areConfigKeysPresent(['jwtPrivateKey'])) {
        process.exit(1);
    }

    Mongoose.connect('mongodb://localhost/gapshap',{ useNewUrlParser: true , useCreateIndex: true })
        .then(result => console.log("Connected to mongoose"))
        .catch(error => console.log("Could not connect to Mongoose"));

    const server = http.Server(app);
    var io = socket(server);
    io.set('transports', ['websocket']);

    require('./app/manager/socket')(io);

    return server;
}

function areConfigKeysPresent(configKeys) {
    configKeys.forEach(configKey => {
        if(!config.get(configKey)) {
            console.log(`${configKey} missing.`);
            return false;
        }
    });
    return true;
}

module.exports = init;
