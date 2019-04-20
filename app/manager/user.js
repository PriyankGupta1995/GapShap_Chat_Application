'use strict'

const _ = require('lodash');

const userDao = require('../dao/user');
const hashUtils = require('../utils/hash');

async function registerNewUser(userDetails) {
    const user = await userDao.findUserByEmailId(userDetails.emailId);
    if(user) {
        console.log("User already registered.");
    }

    await userDao.createUser(userDetails);
}

async function userLogin(userDetails) {
    const user = await userDao.findUserByEmailId(userDetails.emailId);
    if(!user) {
        console.log("User does not exist.");
    }

    const isAuthenticUser = await hashUtils.compareFields(userDetails.password, user.password);
    if(!isAuthenticUser) {
        console.log("User is unauthentic.");
    }

    const userDetailsWithOnlineStatus = {emailId: userDetails.emailId, status: 'Online'};
    const updatedUser = await updateUser(userDetailsWithOnlineStatus);

    const userToken = userDao.getUserToken(user);
    const loggedInUserDetails = getUserDetailsWithoutPassword(updatedUser);
    return {userToken: userToken, loggedInUserDetails: loggedInUserDetails};
}

async function getUser(userEmailId) {
    const user = await userDao.findUserByEmailId(userEmailId);
    if(!user) {
        console.log("User does not exist.");
    }

    return  getUserDetailsWithoutPassword(user);
}

async function updateUser(userDetailsToUpdate) {
    const updatedUser = await userDao.updateUser(userDetailsToUpdate);
    return getUserDetailsWithoutPassword(updatedUser);
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