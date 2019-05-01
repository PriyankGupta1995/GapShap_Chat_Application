'use strict';

var Mongoose = require('mongoose');

const chatSchema = new Mongoose.Schema({
    chatId: { type: String, required: true, index: true, unique: true },
    messages: [ {username: {type: String, required: true},
        date: {type: Date, required: true},
        content: {type: String, required: true}}],
    messageCount: { type: Number, default: 0}
});

const Chat = Mongoose.model('Chat', chatSchema);

module.exports = Chat;