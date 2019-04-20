'use strict'

const _ = require('lodash');

const User = require('../model/user');
const hashUtils = require('../utils/hash');
const tokenUtils = require('../utils/token');

async function findUserByEmailId(emailId) {
    try {
        return await User.findOne( {emailId: emailId});
    } catch(err) {
        console.log("exception occured findUserByEmailId");
    }
}

async function createUser(userDetails) {
    try {
        const hashedPassword = await hashUtils.hashField(userDetails.password);
        const newUser = new User({
            emailId: userDetails.emailId,
            username: userDetails.username,
            password: hashedPassword
        });

        await newUser.save();
    } catch(err) {
        console.log("Exception occured. createUser");
    }
}

function getUserToken(userDetails) {
    const userTokenFields = _.pick(userDetails, ['emailId', 'username']);
    return tokenUtils.tokenizeItem(userTokenFields);
}

async function updateUser(userDetails) {
    let userDetailsToUpdate = {
        username: userDetails.username,
        profileStatus: userDetails.profileStatus,
        status: userDetails.status,
        password: userDetails.password
    };

    for(let userDetail in userDetailsToUpdate) {
        if(!userDetailsToUpdate[userDetail]) {
            delete userDetailsToUpdate[userDetail];
        }
    }

    try {
        return await User.findOneAndUpdate({emailId: userDetails.emailId}, userDetailsToUpdate, {new: true});
    } catch(error) {
        console.log("Could not update user");
    }
}

module.exports = {
    findUserByEmailId: findUserByEmailId,
    createUser: createUser,
    getUserToken: getUserToken,
    updateUser: updateUser
};