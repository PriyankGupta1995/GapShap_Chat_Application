'use strict'

const router = require('express').Router();
const {validationResult} = require('express-validator/check');
const _ = require('lodash');

const auth = require('../middleware/authentication');
const roomManager = require('../manager/room');

router.get('/all', auth, async (request, response) => {
    const rooms = await roomManager.getAllRooms();
    response.render('rooms', {rooms: rooms});
});

router.post('/create', auth, async (request, response) => {
    const roomTitle = _.pick(request.body, ['title']);
    await roomManager.createNewRoom(roomTitle.title);
    response.redirect('/rooms/all');
});

module.exports = router;