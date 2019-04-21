'use strict';

const bcrypt = require('bcrypt');

const SALT_ROUNDS = 10;

async function hashField(field) {
    const salt = await bcrypt.genSalt(SALT_ROUNDS);
    return await bcrypt.hash(field, salt);
}

async function compareFields(fieldToCompare, hashedField) {
    return await bcrypt.compare(fieldToCompare, hashedField);
}

module.exports = {
    hashField: hashField,
    compareFields: compareFields
};