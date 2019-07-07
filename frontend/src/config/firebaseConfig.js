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

const storage = firebase.storage();

export {storage, firebase as default};