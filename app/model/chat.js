'use strict';

var Mongoose = require('mongoose');

const chatSchema = new Mongoose.Schema({
    chatId: { type: String, required: true, unique: true },
    chats:  [ {userName: {type: String, required: true},
        time: {type: String, required: true}}]
});

const Chat = Mongoose.model('Chat', chatSchema);

module.exports = Chat;