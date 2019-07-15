"use strict";

const allowCrossDomain = (req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
    res.header('Access-Control-Allow-Headers', '*');

    // intercept OPTIONS method
    if ('OPTIONS' == req.method) {
        res.status(200).send(200);
    }
    else {
        next();
    }
};

const checkAuthentication = (req, res, next) => {
    // check header or url parameters or post parameters for token
    let token = ""

    if (req.headers.authorization) {
        token = req.headers.authorization
    }

    if (!token) {
        return res.status(401).send({
            error: 'Unauthorized',
            message: 'No token provided in the request'
        });
    } else {
        next();
    }
};

const errorHandler = (err, req, res, next) => {
    if (res.headersSent) {
        return next(err)
    }
    res.status(500);
    res.render('error', { error: err })
};


module.exports = {
    allowCrossDomain,
    checkAuthentication,
    errorHandler
};