import React, { Component } from 'react'
import firebase from '../config/firebaseConfig';

export default class Verification extends Component {
    constructor(props) {
        super(props);
        this.state = {
            text: null
        }
        this.verify = this.verify.bind(this);
    }


    verify() {
        const user = firebase.auth().currentUser;
        console.log(user)
        user.sendEmailVerification().then(function () {
        }).catch(function (error) {
            console.log(error)
        });
        this.setState({ text: "Please check your inbox. Email sent to " + user.email })
    }
    render() {
        return (
            <div className="container mt-5">
                <div className="mx-auto my-auto p-4 w-50 login-border text-center">
                    <h3 className="login-header">Email Verification</h3>
                    <hr></hr>
                    <form>
                        <div className="form-group text-sub-title text-center" >
                            {this.state.text ? <span style={{ color: "#707070", fontSize: "16px" }}> {this.state.text}</span > : <button className="btn btn-primary" onClick={this.verify}>Send Verification</button>}
                        </div>
                    </form>
                </div>
            </div>
        )
    }
}
