import React, { Component } from 'react';
import firebase from '../config/firebaseConfig';
import { Switch, Route } from 'react-router-dom'
import Navbar from './Navbar'
import Footer from './Footer'
import AdvertisementList from './advertisement/AdvertisementList'
import AdDetails from './advertisement/AdDetails'
import PageNotFound from './PageNotFound'
import NewAdvertisement from "./advertisement/NewAdvertisement"

class Home extends Component {
  constructor(props) {
    super(props);

    this.state = {
      usersList: {},
      advertisements: {},
      categories: {},
      conditions: {}
    }

    this.getUser = this.getUser.bind(this)
    this.getUsers = this.getUsers.bind(this)
    this.getAdvertisements = this.getAdvertisements.bind(this)
    this.getCategories = this.getCategories.bind(this)
    this.getConditions = this.getConditions.bind(this)
  }

  componentDidMount() {
    this.getUser(this.props.user)
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

    this.userRef.off('value')
    this.userRef = null;
  }

  getUser(user) {
    if (user !== undefined) {
      let id = user.uid;
      this.userRef = firebase.database().ref('users').child(id)
      this.userRef.on('value', snap => {
        this.setState({
          user: snap.val()
        })
      })
    }
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
          const conRef = firebase.database().ref('conditions').child(ad.conditionId);
          conRef.on('value', cond => {
            ad.condition = cond.val()
          })

          const ownerRef = firebase.database().ref('users').child(ad.userId);
          ownerRef.on('value', user => {
            ad.user = user.val()
          })

          const mainCatRef = firebase.database().ref('categories').child(ad.mainCategoryId);
          mainCatRef.on('value', cat => {
            const mainCat = cat.val()
            ad.mainCategory = mainCat;
            const subCatRef = firebase.database().ref('sub-categories').child(ad.mainCategoryId).child(ad.subCategoryId);
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
    this.conditionsRef = firebase.database().ref('conditions')
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
          <Navbar user={this.state.user} />
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

export default Home;