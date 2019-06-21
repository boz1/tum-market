import React, { Component } from 'react';
import firebase from '../config/firebaseConfig';
import { Switch, Route } from 'react-router-dom'
import Navbar from './Navbar'
import Footer from './Footer'
import AdvertisementList from './advertisement/AdvertisementList'
import AdDetails from './advertisement/AdDetails'
import PageNotFound from './PageNotFound'
import NewAdvertisement from "./advertisement/NewAdvertisement"
import TradeList from './trade/TradeList'
import { template } from '@babel/core';

class Home extends Component {
  constructor(props) {
    super(props);

    this.state = {
      user: {},
      usersList: {},
      advertisements: {},
      sug:{},
      categories: {},
      conditions: {}
    }

    this.getUser = this.getUser.bind(this)
    this.getUsers = this.getUsers.bind(this)
    this.getAdvertisements = this.getAdvertisements.bind(this)
    this.getCategories = this.getCategories.bind(this)
    this.getConditions = this.getConditions.bind(this)
    this.search = this.search.bind(this);

  }

  componentDidMount() {
    this.getUsers()
    this.getCategories()
    this.getConditions()
    this.getAdvertisements(this.props.user, this.getUser)
      .catch(function (err) { console.log(err) })
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

    this.userAdsRef.off('value')
    this.userAdsRef = null;

    this.userBuyReqRef.off('value')
    this.userBuyReqRef = null;

    this.userTradeReqRefSent.off('value')
    this.userTradeReqRefSent = null;

    this.userTradeReqRefReceived.off('value')
    this.userTradeReqRefReceived = null;
  }

  getUser(user) {
    if (user !== undefined) {
      const id = user.uid;

      this.userRef = firebase.database().ref('users').child(id)
      this.userRef.on('value', snap => {
        let val = snap.val();
        let stateObj = this.state.user;
        stateObj.info = val;
        this.setState({
          user: stateObj
        })
      })


      this.userAdsRef = firebase.database().ref('advertisements').child(id)
      this.userAdsRef.on('value', snap => {
        let val = snap.val();
        let stateObj = this.state.user;
        stateObj.ads = val;
        this.setState({
          user: stateObj
        })
      })

      this.userBuyReqRef = firebase.database().ref('buying-requests').child(id)
      this.userBuyReqRef.on('value', snap => {
        let val = snap.val();
        let stateObj = this.state.user;
        stateObj.buyReq = val;
        this.setState({
          user: stateObj
        })
      })

      this.userTradeReqRefSent = firebase.database().ref('trade-requests').child(id)
      this.userTradeReqRefSent.on('value', snap => {
        var data = [];
        snap.forEach(ss => {
          data.push(ss.val());
        });

        let stateObj = this.state.user;
        stateObj.tradeReq = data;
        this.setState({
          user: stateObj
        })
      });

      this.userTradeReqRefReceived = firebase.database().ref('received-offers').child(id)
      this.userTradeReqRefReceived.on('value', snap => {
        var data = [];
        snap.forEach(ss => {
          data.push(ss.val());
        });

        let stateObj = this.state.user;
        stateObj.receivedOffers = data;
        this.setState({
          user: stateObj
        })
      });
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

  getAdvertisements(currentUser, cb) {
    return new Promise((resolve, reject) => {
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
          advertisements: ads,
          sug:ads
        })

        if (this.state.advertisements.length !== undefined) {
          resolve(cb(currentUser))
        }
        else {
          reject('ads error')
        }

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
  search(input){
    console.log(this.state.advertisements)
    console.log(this.state.sug)

    console.log(input.target.value.length)
    if(input.target.value.length ===0)
      this.setState({sug:this.state.advertisements})
      else{
    const regix=new RegExp(`^${input.target.value}`,'i')
    this.setState({sug:this.state.advertisements.filter(ad => regix.test(ad.title))})  
  }
}
  render() {
    return (
      <React.Fragment>
        <div className="container">
          <Navbar ad={this.search} user={this.state.user} />
          <Switch>
            <Route exact path="/" render={(props) => <AdvertisementList {...props} adsList={this.state.sug} user={this.state.user}/>} />
            <Route path="/tradeRequests" render={(props) => <TradeList {...props} user={this.state.user} />} />
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