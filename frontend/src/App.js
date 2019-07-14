import React, { Component } from 'react';
import './App.css';
import Home from './components/Home';
import Login from './components/Login';
import HomeService from './services/HomeService'
import AuthService from './services/AuthService'

class App extends Component {
  constructor() {
    super()

    this.state = {
      user: null,
      userInfo: {},
      mount: 0,
      verified: false,
      advertisements: {},
      buyingRequests: {},
      sug: {},
      categories: {},
      subCategories: {},
      conditions: {},
      ads: [],
      users: [],
      buyreqs: [],
      buySug: [],
      market: "sellers"
    }

    this.search = this.search.bind(this);
    this.filteredSearch = this.filteredSearch.bind(this);
    this.getAdvertisements = this.getAdvertisements.bind(this)
    this.getBuyingRequest = this.getBuyingRequest.bind(this)
    this.getMainContent = this.getMainContent.bind(this)
    this.getUserContent = this.getUserContent.bind(this)
    this.authListener = this.authListener.bind(this);
    this.getCategory = this.getCategory.bind(this);
  }

  componentDidMount() {
    this.authListener();
  }

  authListener() {
    AuthService.getUser().then((data) => {
      let us = data.us
      if (us && us.emailVerified) {
        this.setState({ user: us, mount: 1 });
        localStorage.setItem('user', us.uid);
        this.getMainContent()
        this.getUserContent(us)
      } else {
        this.setState({ user: "", mount: 1 });
        localStorage.removeItem('user');
      }
    })
      .catch((er) => {
        console.log(er)
      })
  }

  getUserContent(us) {
    HomeService.getUserContent(us)
      .then((data) => {
        this.setState({
          userInfo: data.obj
        })
        this.getAdvertisements()
        this.getBuyingRequest()
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
          buyreqs: data.obj.buyreqs,
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

    if (data.ads !== undefined && data.ads !== null) {
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
      }

      this.setState({
        advertisements: ads,
        sug: ads
      })
    }
  }

  getBuyingRequest() {
    let data = this.state
    let buyreqs = [];

    if (data.buyreqs !== undefined && data.buyreqs !== null) {
      if (data.buyreqs.length !== 0) {
        Object.keys(data.buyreqs).forEach(function (user) {
          Object.values(data.buyreqs[user]).forEach(function (buy) {

            if (buy !== null) {
              buy.user = data.users[user]
              buy.mainCategory = data.categories[buy.mainCategoryId]
              buy.subCategory = data.subCategories[buy.mainCategoryId][buy.subCategoryId]
              buyreqs.push(buy)
            }

          })
        })
      }

      this.setState({
        buyingRequests: buyreqs,
        buySug: buyreqs
      })
    }
  }

  reRender = () => {
    this.getMainContent()
    this.getUserContent(this.state.user)
  }

  search(input) {
    if (input === "null" || input === undefined) {
      if (this.state.market === 'sellers') {
        this.setState({ sug: this.state.advertisements }, () => this.forceUpdate())
      } else {
        this.setState({ buySug: this.state.buyingRequests }, () => this.forceUpdate())
      }
    }
    else {
      input.preventDefault()
      if (this.state.market === 'sellers') {
        if (input.target.value.length === 0)
          this.setState({ sug: this.state.advertisements }, () => this.forceUpdate())
        else {
          const regix = new RegExp(`${input.target.value}`, 'i')
          this.setState({ sug: this.state.advertisements.filter(ad => regix.test(ad.title)) }, () => this.forceUpdate())
        }
      }
      else {
        if (input.target.value.length === 0)
          this.setState({ buySug: this.state.buyingRequests }, () => this.forceUpdate())
        else {
          const regix = new RegExp(`${input.target.value}`, 'i')
          this.setState({ buySug: this.state.buyingRequests.filter(buy => regix.test(buy.title)) }, () => this.forceUpdate())
        }
      }
    }
  }

  filteredSearch(input) {
    console.log(input)
    if (input.market === "Seller's Market") {

      console.log(input)
      /*  if (input.target.value.length === 0)
        this.setState({ sug: this.state.advertisements }, () => this.forceUpdate())
        else {
          const regix = new RegExp(`${input.target.value}`, 'i')
          this.setState({ sug: this.state.advertisements.filter(ad => regix.test(ad.title)) }, () => this.forceUpdate())
        }*/
    }
    else {
      console.log(input)
      /*if (input.target.value.length === 0)
        this.setState({ buySug: this.state.buyingRequests }, () => this.forceUpdate())
      else {
        const regix = new RegExp(`${input.target.value}`, 'i')
        this.setState({ buySug: this.state.buyingRequests.filter(buy => regix.test(buy.title)) }, () =>  this.forceUpdate())
      }
      */
    }

  }

  getCategory(cat) {
    const mainCat = cat.split('-')[0]
    const subCat = cat.split('-')[1]
    if (this.state.market === 'sellers') {
      // Main Category
      if (subCat === "*") {
        this.setState({
          sug: this.state.advertisements.filter(ad =>
            ad.mainCategoryId === parseInt(mainCat)
          )
        }, () => this.forceUpdate())
      }
      else { // Sub Category
        this.setState({
          sug: this.state.advertisements.filter(ad =>
            ad.mainCategoryId === parseInt(mainCat) && ad.subCategoryId === parseInt(subCat)
          )
        }, () => this.forceUpdate())
      }
    } else {
      // Main Category
      if (subCat === "*") {
        this.setState({
          buySug: this.state.buyingRequests.filter(buy =>
            buy.mainCategoryId === parseInt(mainCat)
          )
        }, () => this.forceUpdate())
      }
      else { // Sub Category
        this.setState({
          buySug: this.state.buyingRequests.filter(buy =>
            buy.mainCategoryId === parseInt(mainCat) && buy.subCategoryId === parseInt(subCat)
          )
        }, () => this.forceUpdate())
      }
    }
  }

  updateMarket = (market) => {
    if (this.state.market !== market) {
      this.setState({
        market: market
      })
    }
  }

  render() {
    if (this.state.mount) {
      return (
        <div>{this.state.user ? (<Home getCategory={this.getCategory} updateMarket={this.updateMarket} filteredSearch={this.filteredSearch} search={this.search} buyingRequests={this.state.buyingRequests} buySug={this.state.buySug} reRender={this.reRender} user={this.state.userInfo} advertisements={this.state.advertisements} sug={this.state.sug} categories={this.state.categories} subCategories={this.state.subCategories} conditions={this.state.conditions} />) : <Login verify={this.authListener} />}</div>)
    }
    else {
      return (<div></div>)
    }
  }
}

export default App;