import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import * as serviceWorker from './serviceWorker';
import * as firebase from 'firebase'

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

ReactDOM.render(<App />, document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();