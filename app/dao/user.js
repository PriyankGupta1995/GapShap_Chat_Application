'use strict';

const _ = require('lodash');

const User = require('../model/db/user');
const hashUtils = require('../utils/hash');
const tokenUtils = require('../utils/token');
const {InternalServiceError} = require('../model/custom-errors');

async function findUserByEmailId(emailId) {
    try {
        return await User.findOne( {emailId: emailId});
    } catch(err) {
        throw new InternalServiceError(`findUserByEmailId with emailId: ${emailId}`);
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
        throw new InternalServiceError(`createUser with emailId: ${userDetails.emailId}`);
    }
}

function getUserToken(userDetails) {
    const userTokenFields = _.pick(userDetails, ['emailId', 'username']);
    return tokenUtils.tokenizeItem(userTokenFields);
}

async function updateUser(userDetails) {
    let userDetailsToUpdate = getNonEmptyUserDetailsToUpdate(userDetails);

    try {
        if (userDetailsToUpdate.password) {
            userDetailsToUpdate.password = hashUtils.hashField(userDetailsToUpdate.password);
        }
        if(userDetails.connection) {
            const connection = {
                userId: userDetails.connection.emailId,
                username: userDetails.connection.username
            };

            const updatedUser = await User.findOneAndUpdate(
                {emailId: userDetails.emailId, 'connections.userId' : {$ne: connection.userId}},
                {$set: userDetailsToUpdate, $push: {connections: connection}}, {new: true});

            if(updatedUser) {
                return updatedUser;
            } else {
                return findUserByEmailId(userDetails.emailId);
            }

            return updatedUser;
    }
        else {
            return await User.findOneAndUpdate({emailId: userDetails.emailId}, userDetailsToUpdate, {new: true});
        }
    } catch(error) {
        console.log(error);
        throw new InternalServiceError(`updateUser with emailId: ${userDetails.emailId}`);
    }
}

function getNonEmptyUserDetailsToUpdate(userDetails) {
    let userDetailsToUpdate = {
        username: userDetails.username,
        profileStatus: userDetails.profileStatus,
        status: userDetails.status,
        password: userDetails.password,
    };

    for (let userDetail in userDetailsToUpdate) {
        if (!userDetailsToUpdate[userDetail]) {
            delete userDetailsToUpdate[userDetail];
        }
    }
    return userDetailsToUpdate;
}

module.exports = {
    findUserByEmailId: findUserByEmailId,
    createUser: createUser,
    getUserToken: getUserToken,
    updateUser: updateUser
};