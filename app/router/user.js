'use strict';

const router = require('express').Router();
const {validationResult} = require('express-validator/check');
const _ = require('lodash');

const auth = require('../middleware/authentication');
const validator = require('../middleware/request-validator');
const userManager = require('../manager/user');
const {InvalidRequestError} = require('../model/custom-errors');

router.post('/register', validator.userRegistration, async (request, response, next) => {
    if(!isRequestValid(request)) {
        request.flash('showRegisterForm', true);
        response.redirect('/');
    }

    const userDetails = _.pick(request.body, ['emailId', 'username', 'password']);
    try {
        await userManager.registerNewUser(userDetails);
        request.flash('success', 'Your account has been created. Please log in.');
        response.redirect('/');
    } catch (error) {
        handleRegisterUserError(error, request, response, next);
    }
});

router.post('/login', validator.userLogin, async (request, response, next) => {
    if(!isRequestValid(request)) {
        response.redirect('/');
    }
    const userDetails = _.pick(request.body, ['emailId', 'password']);
    try {
        const {userToken, loggedInUserDetails} = await userManager.userLogin(userDetails);
        response.cookie('auth', userToken, {httpOnly: true});
        response.render('home', { userDetails: loggedInUserDetails});
    } catch(error) {
        if(error instanceof InvalidRequestError) {
            request.flash('error', error.message);
            response.redirect('/');
        } else {
            next(error);
        }
    }
});

router.post('/search', auth, validator.userEmail, async (request, response, next) => {
    try {
        if(!isRequestValid(request)) {
            throw new InvalidRequestError(`Invalid user search request. ${request.flash(error)}`);
        }
        const searchUserEmailId = request.body.emailId;
        const userDetails = await userManager.getUser(searchUserEmailId);

        response.redirect(`/user/chat/${userDetails.emailId}`);
    } catch(error) {
        next(error);
    }
});

router.get('/checkProfile/:emailId', auth, validator.userEmail, async (request, response, next) => {
    try {
        if(!isRequestValid(request)) {
            throw new InvalidRequestError(`Invalid check user profile request. ${request.flash(error)}`);
        }
        const userEmailId = request.params.emailId;
        const isProfileUpdatable = request.user.emailId === userEmailId;
        let userDetails = await userManager.getUser(userEmailId);

        userDetails = _.pick(userDetails, ['emailId','username','profileStatus','profilePicture']);
        response.render('profile', {userDetails: userDetails, isUpdate: isProfileUpdatable});
    } catch(error) {
        next(error);
    }
});

router.post('/updateProfile', auth, validator.updateProfile, async(request, response, next) => {
    try {
        if(!isRequestValid(request)) {
            throw new InvalidRequestError(`Invalid update user profile request. ${request.flash(error)}`);
        }
        const userDetails = _.pick(request.body, ['emailId', 'username', 'profileStatus', 'password']);

        const updatedUserDetails = await userManager.updateUser(userDetails);
        response.render('home', {userDetails: updatedUserDetails});
    } catch(error) {
        next(error);
    }
});

router.get('/chat/:emailId', auth, validator.userEmail, async (request, response, next) => {
    try {
        if(!isRequestValid(request)) {
            throw new InvalidRequestError(`Invalid chat request. ${request.flash(error)}`);
        }

        const userEmailId = _.pick(request.params, ['emailId']);
        const userDetails = await userManager.getUser(userEmailId.emailId);
        const displayedUserDetails = {
            userId: userDetails.emailId,
            username: userDetails.username
        };

        const userDetailsToUpdate = {
            emailId: request.user.emailId,
            connection: _.pick(userDetails,['emailId','username'])
        };
        const updatedUser = await userManager.updateUser(userDetailsToUpdate);
        const updatedUserDetails = _.pick(updatedUser,['emailId','username']);

        response.render('chat', {title: displayedUserDetails.username,
            connections: [displayedUserDetails], isRoom: false, userDetails: updatedUserDetails});
    } catch(error) {
        next(error);
    }
});

router.get('/logout', auth, async (request, response, next) => {
    request.session.destroy();
    try {
        await userManager.updateUser({emailId: request.user.emailId, status: 'Offline'});
        response.redirect('/');
    } catch(error) {
        next(error);
    }
});

function isRequestValid(request) {
    const errors = validationResult(request);
    if(!errors.isEmpty()) {
        errors.array().forEach( error => {
            request.flash('error', error.msg)
        });
        return false;
    } else {
        return true;
    }
}

function handleRegisterUserError(error, request, response, next) {
    if (error instanceof InvalidRequestError) {
        request.flash('error', error.message);
        request.flash('showRegisterForm', true);
        response.redirect('/');
    } else {
        next(error);
    }
}

module.exports = router;