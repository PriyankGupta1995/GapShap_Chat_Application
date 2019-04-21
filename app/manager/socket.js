'use strict';

const roomDao = require('../dao/room');

function ioEvents(io) {
    io.of('/user/chat').on('connection', function(socket) {

        socket.on('joinUser', function(currentUserEmailId, chatUserEmailId) {
            const userChatId = (currentUserEmailId < chatUserEmailId)?
                currentUserEmailId + chatUserEmailId
                : chatUserEmailId + currentUserEmailId;

            socket.join(userChatId);
            socket.emit('userChatId', userChatId);
        });

        socket.on('newMessageUser', function(userChatId, message) {
            socket.broadcast.to(userChatId).emit('addMessageUser', message);
        });

    });

    io.of('/rooms/chat').on('connection', async function(socket) {

        socket.on('joinRoom', async function (roomTitle) {
            socket.join(roomTitle);

            const updatedRoomDetails = await roomDao.findRoomByTitle(roomTitle);
            const updatedUsersList = updatedRoomDetails.connections;

            socket.broadcast.to(roomTitle).emit('updateUsersList', updatedUsersList);
        });

        socket.on('newMessageRoom', function (roomTitle, message) {
            socket.broadcast.to(roomTitle).emit('addMessageRoom', message);
        });

        socket.on('disconnect', function () {
            socket.emit('getRoomTitle');
        });

        socket.on('removeUser', async function (roomTitle, userEmailId) {
            const updatedRoom = await roomDao.removeFromRoom(roomTitle, userEmailId);
            socket.emit('removeUser', userEmailId);
            socket.leave(roomTitle);
            socket.broadcast.to(roomTitle).emit('removeUser', userEmailId);
        });
    });
};

module.exports = ioEvents;

