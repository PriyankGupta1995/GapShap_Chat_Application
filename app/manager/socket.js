'use strict';

const roomDao = require('../dao/room');
const chatDao = require('../dao/chat');

function ioEvents(io) {
    io.of('/user/chat').on('connection', function(socket) {

        socket.on('joinUser', function(currentUserEmailId, chatUserEmailId, chatId) {

            // console.log(`Current user: ${currentUserEmailId}`);
            // console.log(`Chat user: ${chatUserEmailId}`);
            // console.log(`Chat Id(Join): ${userChatId}`);
            socket.join(chatId);
        });

        socket.on('newMessageUser', async function(chatId, message) {
            
            const chatDetails = {
                chatId: chatId,
                message: message
            };
            await chatDao.addMessage(chatDetails);
            socket.broadcast.to(chatId).emit('addMessageUser', message);
        });

        socket.on('editMessageUser', async function(chatId, message) {

            const chatDetails = {
                chatId: chatId,
                message: message
            };
            const updatedChat = await chatDao.editMessage(chatDetails);

            socket.broadcast.to(chatId).emit('updateChatUser', updatedChat.messages);

            // add broadcasting logic
        });

        socket.on('deleteMessageUser', async function(chatId, message) {

            const chatDetails = {
                chatId: chatId,
                message: message
            };
            const updatedChat = await chatDao.deleteMessage(chatDetails);

            socket.broadcast.to(chatId).emit('updateChatUser', updatedChat.messages);
        });

        socket.on('loadMoreMessagesUser', async function (chatId, pageNumber) {

            const additionalChat = await chatDao.findChatById(chatId, pageNumber);
            if(additionalChat) {
                socket.emit("additionalMessagesUser", additionalChat.messages, additionalChat.pageNumber);
            }
        });

    });

    io.of('/rooms/chat').on('connection', async function(socket) {

        let roomTitleChat, currentUserEmailId;

        socket.on('joinRoom', async function (roomTitle, userEmailId) {
            socket.join(roomTitle);

            roomTitleChat = roomTitle;
            currentUserEmailId = userEmailId;

            const updatedRoomDetails = await roomDao.findRoomByTitle(roomTitle);
            const updatedUsersList = updatedRoomDetails.connections;
            console.log(`Updated UsersList(Join): ${updatedUsersList}`);

            socket.broadcast.to(roomTitle).emit('updateUsersList', updatedUsersList);
        });

        socket.on('newMessageRoom', async function (roomTitle, message) {
            const chatDetails = {
                chatId: roomTitle,
                message: message
            };
            await chatDao.addMessage(chatDetails);

            socket.broadcast.to(roomTitle).emit('addMessageRoom', message);
        });

        socket.on('editMessageRoom', async function (roomTitle, message) {
            const chatDetails = {
                chatId: roomTitle,
                message: message
            };
            await chatDao.editMessage(chatDetails);

            // add broadcasting logic
        });

        socket.on('deleteMessageRoom', async function (roomTitle, message) {
            const chatDetails = {
                chatId: roomTitle,
                message: message
            };
            const updatedChat = await chatDao.deleteMessage(chatDetails);

            socket.broadcast.to(roomTitle).emit('updateChatRoom', updatedChat.messages);
        });

        socket.on('loadMoreMessagesRoom', async function (roomTitle, pageNumber) {

            console.log(`Page Number: ${pageNumber}`);
            const additionalChat = await chatDao.findChatById(roomTitle, pageNumber);
            if(additionalChat) {
                socket.emit("additionalMessagesRoom", additionalChat.messages, additionalChat.pageNumber);
            }
        });



        socket.on('disconnect', async function () {
            const updatedRoom = await roomDao.removeFromRoom(roomTitleChat, currentUserEmailId);

            console.log(`Updated UsersList(Delete): ${updatedRoom.connections}`);

            socket.leave(roomTitleChat);
            socket.broadcast.to(roomTitleChat).emit('removeUser', currentUserEmailId);
        });
    });
}

module.exports = ioEvents;

