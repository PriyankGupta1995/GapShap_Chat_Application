'use strict';

const _ = require('lodash');

const chatDao = require('../dao/chat');
const {InvalidRequestError} = require('../model/custom-errors');

async function getChat(chatId) {
    try {
        const chat = await chatDao.findChatById(chatId, 1);
        if(chat) {
            return chat;
        }
        else {
            return await chatDao.createChat(chatId);
        }
    } catch (error) {
        throw error;
    }
}

module.exports = {
    getChat: getChat
};