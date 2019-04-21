'use strict';

class DomainError extends Error {
    constructor(message) {
        super(message);
        this.name = this.constructor.name;
        Error.captureStackTrace(this, this.constructor);
    }
}

class InternalServiceError extends DomainError {
    constructor(message) {
        super(`Error occured: ${message}`);
    }
}

class InvalidRequestError extends DomainError {
    constructor(message) {
        super(message);
    }
}

module.exports = {
    InternalServiceError,
    InvalidRequestError
};