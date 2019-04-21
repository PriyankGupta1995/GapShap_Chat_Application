'use strict';

var Mongoose = require('mongoose');

const roomSchema = new Mongoose.Schema({
    title: { type: String, required: true, index: true, unique: true },
    connections: [ {userId: {type: String, required: true},
        username: {type: String, required: true}}]
});

const Room = Mongoose.model('Room', roomSchema);

module.exports = Room;