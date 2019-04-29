'use strict';

const Chat = require('../model/db/chat');
const {InternalServiceError} = require('../model/custom-errors');

async function findChatById(chatId) {
    try {
        return await Chat.findOne( {chatId: chatId});
    } catch(error) {
        throw new InternalServiceError(`findChatById with ${chatId}`);
    }
}

async function createChat(chatId) {
    const newChat = new Chat({chatId: chatId});
    try {
        return await newChat.save();
    } catch(err) {
        throw new InternalServiceError(`createChat with ${chatId}`);
    }
}

async function addMessage(chatDetails) {
    if(!chatDetails.message) {
        return findChatById(chatDetails.chatId);
    }

    const message = {
        username: chatDetails.message.username,
        date: chatDetails.message.date,
        content: chatDetails.message.content
    };

    try {
        return await Chat.findOneAndUpdate({chatId: chatDetails.chatId},
            {$push: {messages: message}}, {new:true});
    } catch(error) {
        throw new InternalServiceError(`addMessage with ${chatDetails.chatId}`);
    }
}

async function editMessage(chatDetails) {
    if(!chatDetails.message) {
        return findChatById(chatDetails.chatId);
    }

    const message = {
        username: chatDetails.message.username,
        date: chatDetails.message.date,
        content: chatDetails.message.content
    };

    try {
        return await Chat.findOneAndUpdate({chatId: chatDetails.chatId},
            {$push: {messages: message}}, {new:true});
    } catch(error) {
        throw new InternalServiceError(`addMessage with ${chatDetails.chatId}`);
    }
}

module.exports = {
    findChatById: findChatById,
    createChat: createChat,
    addMessage: addMessage
};