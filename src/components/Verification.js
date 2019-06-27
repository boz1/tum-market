import React, { Component } from 'react'
import firebase from '../config/firebaseConfig';

export default class Verification extends Component {
    render() {
        var user = firebase.auth().currentUser;
        console.log(user)
        return (
            <div>
                <h1>Please verfy your email address</h1>
                <button>Send verification again</button>
            </div>
        )
    }
}
