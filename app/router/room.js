'use strict';

const router = require('express').Router();
const {validationResult} = require('express-validator/check');
const _ = require('lodash');

const auth = require('../middleware/authentication');
const roomManager = require('../manager/room');
const {InvalidRequestError} = require('../model/custom-errors');

router.get('/all', auth, async (request, response, next) => {
    try {
        const rooms = await roomManager.getAllRooms();
        response.render('rooms', {rooms: rooms , error: request.flash('error')});
    } catch(error) {
        next(error);
    }
});

router.post('/create', auth, async (request, response, next) => {
    try {
        await roomManager.createNewRoom(request.body.title);
        response.redirect('/rooms/all');
    } catch(error) {
        if(error instanceof InvalidRequestError) {
            request.flash('error', error.message);
            response.redirect('/rooms/all');
        } else {
            next(error);
        }
    }
});

router.get('/chat/:title', auth, async (request, response, next) => {
    try {
        const room = await roomManager.getRoom(request.params.title);

        const roomDetailsToUpdate = {
            title: room.title,
            connection: _.pick(request.user,['emailId','username'])
        };
        const updatedRoom = await roomManager.updateRoom(roomDetailsToUpdate);

        const userDetails = _.pick(request.user,['emailId','username']);
        response.render('chat', {title: room.title, connections: updatedRoom.connections, isRoom: true,
            userDetails: userDetails});
    } catch(error) {
        next(error);
    }
});

module.exports = router;