import React, { Component } from 'react';
import './App.css';
import firebase from './config/firebaseConfig'
import Home from './components/Home';
import Login from './components/Login';

class App extends Component {
  constructor() {
    super()

    this.state = {
      user: null,
      mount: 0
    }

    this.authListener = this.authListener.bind(this);
  }

  componentDidMount() {
    this.authListener();
  }

  authListener() {
    firebase.auth().onAuthStateChanged((us) => {
      if (us) {
        this.setState({ user: us, mount: 1 });
        localStorage.setItem('user', us.uid);
      } else {
        this.setState({ user: "", mount: 1 });
        localStorage.removeItem('user');
      }
    });
  }

  render() {
    if (this.state.mount) {
      return (
        <div>{this.state.user ? (<Home user={this.state.user} />) : <Login />}</div>)
    }
    else {
      return (<div></div>)
    }
  }
}

export default App;
