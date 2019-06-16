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
      user: "",
      usersList: {},
      advertisements: {},
      categories: {},
      conditions: {}
    }
    this.getUser = this.getUsers.bind(this)
    this.getAdvertisements = this.getAdvertisements.bind(this)
    this.getCategories = this.getCategories.bind(this)
    this.getConditions = this.getConditions.bind(this)
  }

  componentDidMount() {
    this.getUsers()
    this.getAdvertisements()
    this.getCategories()
    this.getConditions()
  }

  componentWillUnmount(){
    this.usersRef.off('value')
    this.usersRef= null;

    this.adsRef.off('value')
    this.adsRef= null;

    this.categoriesRef.off('value')
    this.categoriesRef= null;

    this.conditionsRef.off('value')
    this.conditionsRef= null;
  }

  getUsers() {
    this.usersRef = firebase.database().ref('users')
    this.usersRef.on('value', snap => {
      this.setState({
        usersList: snap.val()
      })
    })
  }

  getAdvertisements() {
    this.adsRef = firebase.database().ref('advertisements')
    this.adsRef.on('value', snap => {
      let data = snap.val();
      let ads = [];
      Object.keys(data).forEach(function(user){
        data[user].forEach(function(ad){
          ads.push(ad)
        })
      });
      this.setState({
        advertisements: ads
      })
    })
  }

  getCategories() {
    this.categoriesRef = firebase.database().ref('categories')
    this.categoriesRef.on('value', snap => {
      this.setState({
        categories: snap.val()
      })
    })
  }

  getConditions() {
    this.conditionsRef = firebase.database().ref('conditionsRef')
    this.conditionsRef.on('value', snap => {
      this.setState({
        conditions: snap.val()
      })
    })
  }

  render() {
    return (
      <React.Fragment>
        <div className="container">
          <Navbar/>
          <div className="d-flex">
            <div className="col-md-3">
              <Colbar></Colbar>
            </div>
            <div className="col-md-9">
              <Switch>
                <Route exact path="/" render={(props) => <AdvertisementList {...props} adsList={this.state.advertisements}/>} />
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
