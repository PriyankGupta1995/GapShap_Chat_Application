'use strict'

const router = require('express').Router();
const {validationResult} = require('express-validator/check');
const _ = require('lodash');

const auth = require('../middleware/authentication');
const validator = require('../middleware/request-validator');
const userManager = require('../manager/user');

router.post('/register', validator.userRegistration, async (request, response) => {
    if(!isRequestValid(request)) {
        request.flash('showRegisterForm', true);
        response.redirect('/');
    }

    const userDetails = _.pick(request.body, ['emailId', 'username', 'password']);
    await userManager.registerNewUser(userDetails);
    request.flash('success', 'Your account has been created. Please log in.');
    response.redirect('/');
});

router.post('/login', validator.userLogin, async (request, response) => {
    if(isRequestValid(request)) {
        const userDetails = _.pick(request.body, ['emailId', 'password']);
        const {userToken, loggedInUserDetails} = await userManager.userLogin(userDetails);

        response.cookie('auth', userToken, {httpOnly: true});
        response.render('home', { userDetails: loggedInUserDetails});
    } else {
        response.redirect('/');
    }
});

router.post('/search', auth, validator.userEmail, async (request, response) => {
    if(isRequestValid(request)) {
        const userEmailId = _.pick(request.body, ['emailId']);
        const userDetails = await userManager.getUser(userEmailId.emailId);

        response.redirect(`/user/chat/${userDetails.emailId}`);
    } else {
        console.log('Invalid Request in search');
        response.redirect('/');
    }
});

router.post('/checkProfile', auth, validator.userEmail, async (request, response) => {
    if(isRequestValid(request)) {
        const userEmailId = request.body.emailId;
        const isUpdate = request.user.emailId === userEmailId;
        let userDetails = await userManager.getUser(userEmailId);
        userDetails = _.pick(userDetails, ['emailId','username','profileStatus','profilePicture']);
        response.render('profile', {userDetails: userDetails, isUpdate: isUpdate});
    } else {
        console.log('Invalid Request in search');
        response.redirect('/');
    }
});

router.post('/updateProfile', auth, validator.updateProfile, async(request, response) => {
    if(isRequestValid(request)) {
        const userDetails = _.pick(request.body, ['emailId', 'username', 'profileStatus', 'password']);

        const updatedUserDetails = await userManager.updateUser(userDetails);
        response.render('home', {userDetails: updatedUserDetails});
    } else {
        console.log('Invalid Request in update');
        response.redirect('/');
    }
});

router.get('/chat/:emailId', auth, validator.userEmail, async (request, response) => {
    if(isRequestValid(request)) {

        const userEmailId = _.pick(request.params, ['emailId']);
        const userDetails = await userManager.getUser(userEmailId.emailId);
        const displayedUserDetails = _.pick(userDetails, ['emailId','username']);

        response.render('chat', {title: displayedUserDetails.username});
    } else {
        console.log('Invalid Request in chat');
        response.redirect('/');
    }
});

router.get('/logout', auth, async (request, response) => {
    request.session.destroy();
    await userManager.updateUser({emailId: request.user.emailId, status: 'Offline'});
    response.redirect('/');
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

module.exports = router;