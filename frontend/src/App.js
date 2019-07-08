import React, { Component } from 'react';
import './App.css';
import firebase from './config/firebaseConfig'
import Home from './components/Home';
import Login from './components/Login';
import HomeService from './services/HomeService'

class App extends Component {
  constructor() {
    super()

    this.state = {
      user: null,
      userInfo: {},
      mount: 0,
      verified: false,
      advertisements: {},
      sug: {},
      categories: {},
      subCategories: {},
      conditions: {},
      ads: [],
      users: []
    }

    this.search = this.search.bind(this);
    this.getAdvertisements = this.getAdvertisements.bind(this)
    this.getMainContent = this.getMainContent.bind(this)
    this.getUserContent = this.getUserContent.bind(this)
    this.authListener = this.authListener.bind(this);
  }

  componentDidMount() {
    this.authListener();
  }

  authListener() {
    firebase.auth().onAuthStateChanged((us) => {
      if (us && us.emailVerified) {
        this.setState({ user: us, mount: 1 });
        localStorage.setItem('user', us.uid);
        this.getMainContent()
        this.getUserContent(us)
      } else {
        this.setState({ user: "", mount: 1 });
        localStorage.removeItem('user');
      }
    });
  }

  getUserContent(us) {
    HomeService.getUserContent(us)
      .then((data) => {
        this.setState({
          userInfo: data.obj
        })
        this.getAdvertisements()
      })
      .catch((error) => {
        console.error(error);
      });
  }

  getMainContent() {
    HomeService.getMainContent()
      .then((data) => {
        this.setState({
          categories: data.obj.categories,
          conditions: data.obj.conditions,
          subCategories: data.obj.subCategories,
          ads: data.obj.ads,
          users: data.obj.users
        })
        this.getUserContent(this.state.user)
      })
      .catch((error) => {
        console.error(error);
      });
  }

  getAdvertisements() {
    let data = this.state
    let ads = [];

    if (data.ads.length !== 0) {
      Object.keys(data.ads).forEach(function (user) {
        Object.values(data.ads[user]).forEach(function (ad) {
          ad.condition = data.conditions[ad.conditionId]
          ad.user = data.users[user]
          ad.mainCategory = data.categories[ad.mainCategoryId]
          ad.subCategory = data.subCategories[ad.mainCategoryId][ad.subCategoryId]
          ads.push(ad)
        })
      })

      this.setState({
        advertisements: ads,
        sug: ads
      })
    }
  }

  reRender = () => {
    this.getMainContent()
    this.getUserContent(this.state.user)
  }

  search(input) {
    if (input.target.value.length === 0)
      this.setState({ sug: this.state.advertisements }, () => this.forceUpdate())
    else {
      const regix = new RegExp(`${input.target.value}`, 'i')
      this.setState({ sug: this.state.advertisements.filter(ad => regix.test(ad.title)) }, () => this.forceUpdate())
    }

  }

  render() {
    if (this.state.mount) {
      return (
        <div>{this.state.user ? (<Home search={this.search} reRender={this.reRender} user={this.state.userInfo} advertisements={this.state.advertisements} sug={this.state.sug} categories={this.state.categories} subCategories={this.state.subCategories} conditions={this.state.conditions} />) : <Login verify={this.authListener} />}</div>)
    }
    else {
      return (<div></div>)
    }
  }
}

export default App;