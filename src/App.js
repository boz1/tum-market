import React, { Component } from 'react';
import { Switch, Route } from 'react-router-dom'
import './App.css';
import firebase from './config/firebaseConfig';
import Navbar from './components/Navbar'
import Colbar from './components/Colbar'
import Footer from './components/Footer'
import AdvertisementList from './components/advertisement/AdvertisementList'
import AdDetails from './components/advertisement/AdDetails'
import PageNotFound from './components/PageNotFound'
import NewAdvertisement from "./components/advertisement/NewAdvertisement"


class App extends Component {
  constructor() {
    super()
    this.state = {
      user: ""
    }
    this.snap = this.snap.bind(this)
  }

  componentDidMount() {
    const rootRef = firebase.database().ref().child('users')
    const usernameRef = rootRef.orderByChild('email').equalTo('user1@mytum.de')
    usernameRef.on('value', this.snap)
  }

  snap(data) {
    this.setState({
      user: data.val()[1].username
    })
  }

  render() {
    return (
      <React.Fragment>
        <div className="container">
          <Navbar></Navbar>
          <div className="d-flex">
            <div className="col-md-3">
            <Colbar></Colbar>
            </div>
            <div className="col-md-9">
            <Switch>
              <Route exact path="/" component={AdvertisementList} />
              <Route path="/adDetails" component={AdDetails} />
              <Route path="/newAdvertisement" component={NewAdvertisement} />
              <Route component={PageNotFound} />
            </Switch>
            </div>
          </div>
          <Footer />
        </div>
      </React.Fragment>
    );
  }

}

export default App;
