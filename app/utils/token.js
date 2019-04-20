'use strict'

const jwt = require('jsonwebtoken');
const config = require('config');

const JWT_CONFIG_KEY = 'jwtPrivateKey';

function tokenizeItem(item) {
    return jwt.sign(item, config.get(JWT_CONFIG_KEY));
}

function validateToken(token) {
    try {
        return jwt.verify(token, config.get(JWT_CONFIG_KEY));
    } catch(ex) {
        console.log("Exception occured");
    }
}

module.exports = {
    tokenizeItem: tokenizeItem,
    validateToken: validateToken
}