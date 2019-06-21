import React, { Component } from 'react';
import './App.css';
import firebase from './config/firebaseConfig'
import Home from './components/Home';
import Login from './components/Login';

class App extends Component {
  constructor() {
    super()

    this.state = {
      user: null
    }

    this.authListener = this.authListener.bind(this);
  }

  componentDidMount() {
    this.authListener();
  }

  authListener() {
    firebase.auth().onAuthStateChanged((user) => {
      if (user) {
        this.setState({ user });
        localStorage.setItem('user', user.uid);
      } else {
        this.setState({ user: null });
        localStorage.removeItem('user');
      }
    });
  }

  render() {
    return (
      <div>{this.state.user ? (<Home />) : (<Login />)}</div>)
  }
}

export default App;
