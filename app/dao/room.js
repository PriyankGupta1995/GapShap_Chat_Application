'use strict';

const Room = require('../model/db/room');
const {InternalServiceError} = require('../model/custom-errors');

async function findRoomByTitle(title) {
    try {
        return await Room.findOne( {title: title});
    } catch(error) {
        throw new InternalServiceError(`findRoomByTitle with ${title}`);
    }
}

async function createRoom(title) {
    const newRoom = new Room({title: title});
    try {
        await newRoom.save();
    } catch(err) {
        throw new InternalServiceError(`createRoom with ${title}`);
    }
}

async function updateRoom(roomDetails) {
    if(!roomDetails.connection) {
        return findRoomByTitle(roomDetails.title);
    }
    const connectionToUpdate = {
        userId: roomDetails.connection.emailId,
        username: roomDetails.connection.username
    };

    try {
        const updatedRoom = await Room.findOneAndUpdate(
            {title: roomDetails.title, 'connections.userId' : {$ne: connectionToUpdate.userId}},
            {$push: {connections: connectionToUpdate}}, {new:true});

        if(updatedRoom) {
            return updatedRoom;
        } else {
            return findRoomByTitle(roomDetails.title);
        }
    } catch(error) {
        throw new InternalServiceError(`updateRoom with ${title}`);
    }
}

async function getAllRooms() {
    try {
        return await Room.find( {}, 'title');
    } catch(err) {
        throw new InternalServiceError("getAllRooms");
    }
}

async function removeFromRoom(title, userEmailId) {
    try {
        const connection = {userId: userEmailId};
        return await Room.findOneAndUpdate(
            {title: title}, {$pull: {connections: connection}}, {new:true});
    } catch(err) {
        throw new InternalServiceError(`removeFromRoom with ${title}`);
    }
}

module.exports = {
    findRoomByTitle: findRoomByTitle,
    createRoom: createRoom,
    updateRoom: updateRoom,
    getAllRooms: getAllRooms,
    removeFromRoom: removeFromRoom
};