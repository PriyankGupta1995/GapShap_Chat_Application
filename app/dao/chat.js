'use strict';

const Chat = require('../model/db/chat');
const {InternalServiceError} = require('../model/custom-errors');

async function findChatById(chatId, pageNumber) {
    const PAGE_SIZE = 10;

    if(!pageNumber) {
        pageNumber = 1;
    }

    const skipNo = PAGE_SIZE * pageNumber;
    try {
        const result = await Chat.findOne({chatId: chatId}, 'messageCount');
        if(result) {
            const messageCount = result.messageCount;
            if(pageNumber!= 1 && skipNo> messageCount+PAGE_SIZE) {
                return null;
            } else {
                const limit = skipNo > messageCount ? messageCount%PAGE_SIZE : PAGE_SIZE;
                const chatArray = await Chat.find( {chatId: chatId}, { messages: {$slice: [-skipNo, limit]}});
                pageNumber = parseInt(pageNumber) + 1;

                const chat = chatArray[0];
                chat['pageNumber'] = pageNumber;
                return chat;
            }
        } else {
            return null;
        }
    } catch(error) {
        throw new InternalServiceError(`findChatById with ${chatId} : ${error.message}`);
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
            {$push: {messages: message}, $inc: { messageCount: 1}},
            {new:true});
    } catch(error) {
        throw new InternalServiceError(`addMessage with ${chatDetails.chatId}`);
    }
}

async function editMessage(chatDetails) {
    if(!chatDetails.message || !chatDetails.message.content) {
        return findChatById(chatDetails.chatId);
    }
    const message =  chatDetails.message;

    try {
        return await Chat.findOneAndUpdate({chatId: chatDetails.chatId, 'messages._id': {$eq: message._id}},
            {$set: {'messages.$.content': message.content}}, {new:true});
    } catch(error) {
        throw new InternalServiceError(`editMessage with ${chatDetails.chatId}`);
    }
}

async function deleteMessage(chatDetails) {
    try {
        if(!chatDetails.message || !chatDetails.message.content) {
            return await findChatById(chatDetails.chatId);
        }
        const message =  chatDetails.message;

        const updatedChat = await Chat.findOneAndUpdate({chatId: chatDetails.chatId, 'messages._id': {$eq: message._id}},
            {$pull: {messages: {_id: message._id}}, $inc: { messageCount: -1}}, {new:true});
        return updatedChat;
    } catch(error) {
        throw new InternalServiceError(`deleteMessage with ${chatDetails.chatId}`);
    }
}

module.exports = {
    findChatById: findChatById,
    createChat: createChat,
    addMessage: addMessage,
    editMessage: editMessage,
    deleteMessage: deleteMessage
};