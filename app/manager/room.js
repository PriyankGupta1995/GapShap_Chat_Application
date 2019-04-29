'use strict';

const _ = require('lodash');

const roomDao = require('../dao/room');
const {InvalidRequestError} = require('../model/custom-errors');

async function createNewRoom(roomTitle) {
    try {
        const room = await roomDao.findRoomByTitle(roomTitle);
        if(room) {
            throw new InvalidRequestError("Room already created.");
        }

        await roomDao.createRoom(roomTitle);
    } catch (error) {
        throw error;
    }
}

async function getAllRooms() {
    try {
        return await roomDao.getAllRooms();
    } catch (error) {
        throw error;
    }
}

async function getRoom(title) {
    try {
        return await roomDao.findRoomByTitle(title);
    } catch (error) {
        throw error;
    }
}

async function updateRoom(roomDetails) {
    try {
        return await roomDao.updateRoom(roomDetails);
    } catch (error) {
        throw error;
    }
}

module.exports = {
    createNewRoom: createNewRoom,
    getAllRooms: getAllRooms,
    getRoom: getRoom,
    updateRoom: updateRoom
};