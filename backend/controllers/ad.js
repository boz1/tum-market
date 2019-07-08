"use strict";

const firebase = require('../firebaseConfig')

const deleteAd = (req, res) => {
    const id = req.params.id;
    const userId = req.params.userId;

    new Promise((resolve) => {
        firebase.database().ref('advertisements').child(userId).child(id).remove();

        resolve()
    })
        .then(() => {
            res.status(200).json({ message: `Ad with id ${id} is deleted` })

        })
        .catch(error => {
            res.status(500).json({
                error: 'Internal server error',
                message: error.message
            })
        })
};

const updateAd = (req, res) => {
    if (Object.keys(req.body).length === 0) return res.status(400).json({
        error: 'Bad Request',
        message: 'The request body is empty'
    });

    const ad = req.body.ad;
    const userId = req.body.userId;

    new Promise((resolve) => {
        var updates = {};
        updates['/advertisements/' + userId + '/' + ad.id] = ad;

        firebase.database().ref().update(updates);

        resolve();
    })
        .then(() => {
            res.status(200).json({ message: `Updated new ad` })
        })
        .catch(error => {
            res.status(500).json({
                error: 'Internal server error',
                message: error.message
            })
        })
};

const createKey = (req, res) => {
    const id = req.params.id;
    let key = {};

    new Promise((resolve) => {
        key = firebase.database().ref('advertisements').child(id).push().key;
        resolve(key)
    })
        .then((obj) => {
            res.status(200).json({ obj });
        })
        .catch((er) => {
            console.log(er)
        });
};

module.exports = {
    deleteAd,
    updateAd,
    createKey
};