import React, { Component } from 'react';
import { Switch, Route } from 'react-router-dom'
import './App.css';
import firebase from './config/firebaseConfig';
import Navbar from './components/Navbar'
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
    this.getAdCondition = this.getAdCondition.bind(this)
  }

  componentDidMount() {
    this.getUsers()
    this.getAdvertisements()
    this.getCategories()
    this.getConditions()
  }

  componentWillUnmount() {
    this.usersRef.off('value')
    this.usersRef = null;

    this.adsRef.off('value')
    this.adsRef = null;

    this.categoriesRef.off('value')
    this.categoriesRef = null;

    this.conditionsRef.off('value')
    this.conditionsRef = null;

    this.mainCatRef.off('value')
    this.mainCatRef = null;

    this.subCatRef.off('value')
    this.subCatRef = null;

    this.condRef.off('value')
    this.condRef = null;
  }

  getAdCondition(id) {
    const condRef = firebase.database().ref('conditionsRef').equalTo(id);
    condRef.on('value', snap => {
      return snap.val()
    })
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
      Object.keys(data).forEach(function (user) {
        data[user].forEach(function (ad) {
          this.condRef = firebase.database().ref('conditions').child(ad.conditionId);
          condRef.on('value', cond => {
            ad.condition = cond.val()
          })

          this.mainCatRef = firebase.database().ref('categories').child(ad.mainCategoryId);
          mainCatRef.on('value', cat => {
            const mainCat = cat.val()
            ad.mainCategory = mainCat;
            this.subCatRef = firebase.database().ref('sub-categories').child(ad.mainCategoryId).child(ad.subCategoryId);
            subCatRef.on('value', sub => {
              const subCat = sub.val();
              ad.subCategory = subCat;
            })
          })
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
          <Navbar />
          <Switch>
            <Route exact path="/" render={(props) => <AdvertisementList {...props} adsList={this.state.advertisements} />} />
            <Route path="/adDetails/:id" component={AdDetails} />
            <Route path="/newAdvertisement" component={NewAdvertisement} />
            <Route component={PageNotFound} />
          </Switch>
          <Footer />
        </div>
      </React.Fragment>
    );
  }

}

export default App;
