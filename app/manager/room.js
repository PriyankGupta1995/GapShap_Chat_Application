'use strict'

const _ = require('lodash');

const roomDao = require('../dao/room');

async function createNewRoom(roomTitle) {
    const room = await roomDao.findRoomByTitle(roomTitle);
    if(room) {
        console.log("Room already created.");
    }

    await roomDao.createRoom(roomTitle);
}

async function getAllRooms() {
    return await roomDao.getAllRooms();
}

module.exports = {
    createNewRoom: createNewRoom,
    getAllRooms: getAllRooms
}