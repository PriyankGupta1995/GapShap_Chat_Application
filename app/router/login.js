'use strict'

const router = require('express').Router();

router.get('/', (request, response) => {
    response.render('login', {
        success: request.flash('success')[0],
        errors: request.flash('error'),
        showRegisterForm: request.flash('showRegisterForm')[0]
    });
});

module.exports = router;

