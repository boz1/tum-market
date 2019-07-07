"use strict";

const firebase = require('firebase')

var firebaseConfig = {
  apiKey: "AIzaSyCpc6o1X4c_vIxMafO2QE29aBDM4w-UPio",
  authDomain: "tum-market.firebaseapp.com",
  databaseURL: "https://tum-market.firebaseio.com",
  projectId: "tum-market",
  storageBucket: "tum-market.appspot.com",
  messagingSenderId: "1018647233485",
  appId: "1:1018647233485:web:ee411c8fc9da26f3"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

// const storage = firebase.storage();


const login = (req, res) => {
    // if (!Object.prototype.hasOwnProperty.call(req.body, 'password')) return res.status(400).json({
    //     error: 'Bad Request',
    //     message: 'The request body must contain a password property'
    // });
    
    // if (!Object.prototype.hasOwnProperty.call(req.body, 'username')) return res.status(400).json({
    //     error: 'Bad Request',
    //     message: 'The request body must contain a username property'
    // });
    // firebase.auth().signInWithEmailAndPassword(req.body.username, req.body.password)
    //     .then((u) => {
    //         console.log('bura')
    //         console.log(u.user)
    //         if (!u.user.emailVerified) {
    //             console.log('b')
    //             res.status(401).send({ u });
    //         }
    //         else {
    //             console.log('c')
    //             res.status(200).json({ u });
    //         }
    //     })
    //     .catch(error => {
    //         console.log('a')
    //     })

    this.userRef = firebase.database().ref('users')
    this.userRef.on('value', snap => {
      let val = snap.val();
      console.log(val)
    })

    console.log('dur')
};


// const register = (req, res) => {
//     if (!Object.prototype.hasOwnProperty.call(req.body, 'password')) return res.status(400).json({
//         error: 'Bad Request',
//         message: 'The request body must contain a password property'
//     });

//     if (!Object.prototype.hasOwnProperty.call(req.body, 'username')) return res.status(400).json({
//         error: 'Bad Request',
//         message: 'The request body must contain a username property'
//     });

//     const user = Object.assign(req.body, { password: bcrypt.hashSync(req.body.password, 8) });


//     UserModel.create(user)
//         .then(user => {

//             // if user is registered without errors
//             // create a token
//             const token = jwt.sign({ id: user._id, username: user.username }, config.JwtSecret, {
//                 expiresIn: 86400 // expires in 24 hours
//             });

//             res.status(200).json({ token: token });


//         })
//         .catch(error => {
//             if (error.code == 11000) {
//                 res.status(400).json({
//                     error: 'User exists',
//                     message: error.message
//                 })
//             }
//             else {
//                 res.status(500).json({
//                     error: 'Internal server error',
//                     message: error.message
//                 })
//             }
//         });

// };


// const me = (req, res) => {
//     UserModel.findById(req.userId).select('username').exec()
//         .then(user => {

//             if (!user) return res.status(404).json({
//                 error: 'Not Found',
//                 message: `User not found`
//             });

//             res.status(200).json(user)
//         })
//         .catch(error => res.status(500).json({
//             error: 'Internal Server Error',
//             message: error.message
//         }));
// };

// const logout = (req, res) => {
//     res.status(200).send({ token: null });
// };


module.exports = {
    login,
    // register,
    // logout,
    // me
};