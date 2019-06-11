import React, {Component} from 'react';
import logo from './logo.svg';
import './App.css';
import * as firebase from 'firebase'

class App extends Component {
  constructor(){
    super()
    this.state = {
      user: ""
    }
    this.snap = this.snap.bind(this)
  }

  componentDidMount(){
    const rootRef = firebase.database().ref().child('users')
    const usernameRef = rootRef.orderByChild('email').equalTo('user1@mytum.de')

    usernameRef.on('value', this.snap)
  }

  snap(data){
    this.setState({
      user: data.val()[1].username
    })
  }

  render(){
    return (
      <div className="App">
        <header className="App-header">
          {this.state.user}
        </header>
      </div>
    );
  }
  
}

export default App;
