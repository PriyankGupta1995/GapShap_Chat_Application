'use strict';

const _ = require('lodash');

const userDao = require('../dao/user');
const hashUtils = require('../utils/hash');
const {InvalidRequestError} = require('../model/custom-errors');

async function registerNewUser(userDetails) {
    try {
        const user = await userDao.findUserByEmailId(userDetails.emailId);
        if(user) {
            throw new InvalidRequestError("User with given email id already exists.");
        }
        await userDao.createUser(userDetails);
    } catch (error) {
        throw error;
    }
}

async function userLogin(userDetails) {
    try {
        const user = await userDao.findUserByEmailId(userDetails.emailId);
        if(!user) {
            throw new InvalidRequestError("Invalid username or password.");
        }

        const isAuthenticUser = await hashUtils.compareFields(userDetails.password, user.password);
        if(!isAuthenticUser) {
            throw new InvalidRequestError("Invalid username or password.");
        }

        const userDetailsWithOnlineStatus = {emailId: userDetails.emailId, status: 'Online'};
        const updatedUser = await updateUser(userDetailsWithOnlineStatus);

        const userToken = userDao.getUserToken(user);
        const loggedInUserDetails = getUserDetailsWithoutPassword(updatedUser);
        return {userToken: userToken, loggedInUserDetails: loggedInUserDetails};
    } catch (error) {
        throw error;
    }

}

async function getUser(userEmailId) {
    try {
        const user = await userDao.findUserByEmailId(userEmailId);
        if(!user) {
            throw new InvalidRequestError("User does not exist.");
        }
        return  getUserDetailsWithoutPassword(user);
    } catch (error) {
        throw error;
    }

}

async function updateUser(userDetailsToUpdate) {
    try {
        const updatedUser = await userDao.updateUser(userDetailsToUpdate);
        return getUserDetailsWithoutPassword(updatedUser);
    } catch (error) {
        throw error;
    }

}

function getUserDetailsWithoutPassword(userDetails) {
    return  _.pick(userDetails, ['emailId','username','status','profileStatus','profilePicture','connections']);
}

module.exports = {
    registerNewUser: registerNewUser,
    userLogin: userLogin,
    getUser: getUser,
    updateUser: updateUser
};