'use strict';

const {InvalidRequestError, InternalServiceError} = require('../model/custom-errors');

function errorHandler(error, request, response, next) {
    console.log(error);
    if(error instanceof InvalidRequestError) {
        response.render('error',{error:'InvalidRequest'});
    }
    response.render('error',{error:'InternalIssue'});
}

module.exports = errorHandler;