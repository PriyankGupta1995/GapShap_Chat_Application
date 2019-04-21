'use strict';

var Mongoose = require('mongoose');

const DEFAULT_USER_PROFILE_STATUS = 'Available';
const DEFAULT_PROFILE_PICTURE = '/img/default-profile-picture.jpg';
const DEFAULT_STATUS = 'Offline';

const userSchema = new Mongoose.Schema({
    emailId: { type: String, required: true, index: true, unique: true },
    username: { type: String, required: true },
    password: { type: String, required: true },
    profileStatus: { type: String, default: DEFAULT_USER_PROFILE_STATUS },
    profilePicture: { type: String, default:  DEFAULT_PROFILE_PICTURE },
    connections: [ {userId: {type: String, required: true},
        username: {type: String, required: true}}],
    status: { type: String, default:  DEFAULT_STATUS }
});

const User = Mongoose.model('User', userSchema);

module.exports = User;
