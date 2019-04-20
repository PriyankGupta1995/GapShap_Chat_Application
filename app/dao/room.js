'use strict'

const Room = require('../model/room');

async function findRoomByTitle(title) {
    try {
        return await Room.findOne( {title: title});
    } catch(err) {
        console.log("exception occured findUserByEmailId");
    }
}

async function createRoom(title) {
    const newRoom = new Room({title: title});
    try {
        await newRoom.save();
    } catch(err) {
        console.log(err);
    }
}

async function updateRoom(roomDetails) {
    if(!connections || connections.length === 0) {
        return;
    }
    const connectionsToUpdate = {connections: connections};

    try {
        await Room.findOneAndUpdate({title: roomDetails.title}, connectionsToUpdate);
    } catch(error) {
        console.log("Could not update room");
    }
}

async function getAllRooms() {
    try {
        return await Room.find( {}, 'title');
    } catch(err) {
        console.log("exception occured getAllRooms");
    }
}

module.exports = {
    findRoomByTitle: findRoomByTitle,
    createRoom: createRoom,
    updateRoom: updateRoom,
    getAllRooms: getAllRooms
};