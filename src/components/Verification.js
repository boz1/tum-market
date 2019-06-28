import React, { Component } from 'react'
import firebase from '../config/firebaseConfig';

export default class Verification extends Component {
    constructor(props) {
        super(props);
        this.state={
            text:null
        }
        this.verify = this.verify.bind(this);
      }
    

      verify(){
        const user = firebase.auth().currentUser;
        console.log(user)
        user.sendEmailVerification().then(function() {
        }).catch(function(error) {
            console.log(error)
        });
        this.setState({text:"email sent to "+user.email})
    }
    render() {
        return (
            <div>
                <h1>Please verify your email address</h1>
                <button onClick={this.verify}>Send verification</button>
                <div>{this.state.text ? <h3> {this.state.text}</h3> : <div></div>}</div>
            </div>
            
        )
    }
}
