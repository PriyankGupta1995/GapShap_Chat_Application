'use strict';

const tokenUtils = require('../utils/token');

function authenticateUser(request, response, next){
    const userToken = request.cookies.auth;
    if(!userToken) {
        return response.render('error', {error: 'Unauthenticated'});
    }

    try {
        const decodedUserDetails = tokenUtils.validateToken(userToken);
        request.user = decodedUserDetails;
        next();
    } catch(error) {
        response.render('error', {error: 'Unauthenticated'});
    }
}

module.exports = authenticateUser;