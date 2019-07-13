"use strict";

const firebase = require('../config/firebaseConfig');

const login = (req, res) => {
    if (Object.keys(req.body).length === 0) return res.status(400).json({
        error: 'Bad Request',
        message: 'The request body is empty'
    });

    const email = req.body.email;
    const password = req.body.password;

    new Promise(() => {
        firebase.auth().signInWithEmailAndPassword(email, password)
            .then((u) => {
                firebase.auth().onAuthStateChanged((us) => {
                    if (!res.headersSent) {
                        res.status(200).json({ us });
                    }
                })
            })
            .catch((error) => {
                res.status(500).json({
                    error: 'Internal server error',
                    message: error.message
                })
            });
    })
};

const getUser = (req, res) => {
    new Promise(() => {
        firebase.auth().onAuthStateChanged((us) => {
            if (!res.headersSent) {
                res.status(200).json({ us });
            }
        })
    })
        .catch((error) => {
            res.status(500).json({
                error: 'Internal server error',
                message: error.message
            })
        });
};

const signup = (req, res) => {
    if (Object.keys(req.body).length === 0) return res.status(400).json({
        error: 'Bad Request',
        message: 'The request body is empty'
    });

    const email = req.body.email;
    const password = req.body.password;
    const newUser = req.body.newUser;

    new Promise(() => {
        firebase.auth().createUserWithEmailAndPassword(email + '@mytum.de', password)
            .then((u) => {
                let userId = u.uid;
                newUser.id = userId;

                var updates = {};
                updates['/users/' + userId] = newUser;

                firebase.database().ref().update(updates);

                u.sendEmailVerification().then(function () {
                    res.status(200).json({
                        message: "User registered"
                    })
                })
            })
            .catch((error) => {
                res.status(500).json({
                    error: 'Internal Server Error',
                    message: error.message
                })
            });
    })
}

const logout = (req, res) => {
    new Promise(() => {
        firebase.auth().signOut();
        
        firebase.auth().onAuthStateChanged((us) => {
            if (!res.headersSent) {
                res.status(200).json({
                    message: "Logged out"
                })
            }
        })

    })
        .catch((error) => {
            res.status(500).json({
                error: 'Internal Server Error',
                message: error.message
            })
        });
}

module.exports = {
    login,
    getUser,
    signup,
    logout
};