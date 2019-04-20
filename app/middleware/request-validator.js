'use strict'

const {check} = require('express-validator/check/index');

const usernameValidator = check('username')
    .exists().withMessage('Username is required.')
    .isAlphanumeric().withMessage('Username should only consist of numbers and letters.')
    .isLength({min: 5}, {max: 50}).withMessage('Username should be at least 5 characters long and at max 50 characters.');

const optionalUsernameValidator = check('username')
    .isAlphanumeric().withMessage('Username should only consist of numbers and letters.')
    .isLength({min: 5}, {max: 50}).withMessage('Username should be at least 5 characters long and at max 50 characters.');

const passwordValidator = check('password')
    .exists().withMessage('Password is required.')
    .isAlphanumeric().withMessage('Password should only consist of numbers and letters.')
    .isLength({min: 8}, {max: 50}).withMessage('Password should be at least 8 characters long and at max 50 characters.')
    .matches('[0-9]').withMessage('Password must contain at least 1 number.')
    .matches('[a-z]').withMessage('Password must contain at least 1 lowercase character.')
    .matches('[A-Z]').withMessage('Password must contain at least 1 uppercase character.');

const emailIdValidator = check('emailId')
    .exists().withMessage('Email id is required.')
    .isEmail().withMessage('Please enter a valid email id.');

const profileStatusValidator = check('profileStatus')
    .exists().withMessage('Status is required.');

const profilePictureValidator = check('profilePicture')
    .exists().withMessage('Profile picture is required.');

const userRegistrationValidator = [emailIdValidator, usernameValidator, passwordValidator];
const userLoginValidator = [emailIdValidator, passwordValidator];
const userEmailIdValidator = [emailIdValidator];
const userUpdateProfileValidator = [emailIdValidator, optionalUsernameValidator];

module.exports = {userRegistration : userRegistrationValidator,
    userLogin: userLoginValidator,
    userEmail: userEmailIdValidator,
    updateProfile: userUpdateProfileValidator
};
