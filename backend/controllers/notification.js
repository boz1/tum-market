"use strict"

const firebase = require('../firebaseConfig')

const deleteNotification = (req, res) => {
    const id = req.params.id;
    const userId = req.params.userId;

    new Promise((resolve) => {
        firebase.database().ref('notifications').child(userId).child(id).remove();
        resolve()
    })
        .then(() => {
            res.status(200).json({ message: `Notification is deleted` })
        })
        .catch(error => {
            res.status(500).json({
                error: 'Internal server error',
                message: error.message
            })
        })
};

const readNotifications = (req, res) => {
    if (Object.keys(req.body).length === 0) return res.status(400).json({
        error: 'Bad Request',
        message: 'The request body is empty'
    });

    let notifReadRef;

    const userId = req.body.userId;

    new Promise((resolve) => {
        notifReadRef = firebase.database().ref('notifications').child(userId).orderByChild('isRead').equalTo(false)
        notifReadRef.once('value').then(function (snap) {
            snap.forEach(function (notification) {
                notification.ref.update({ isRead: true });
            });
        });

        resolve();
    })
        .then(() => {
            res.status(200).json({ message: `Read notifications` })
        })
        .catch(error => {
            res.status(500).json({
                error: 'Internal server error',
                message: error.message
            })
        })
};

module.exports = {
    deleteNotification,
    readNotifications
};