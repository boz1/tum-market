import React, { Component } from 'react';
import { Switch, Route } from 'react-router-dom'
import Navbar from './Navbar'
import Footer from './Footer'
import Marketplace from './advertisement/Marketplace'
import AdDetails from './advertisement/AdDetails'
import PageNotFound from './PageNotFound'
import NewAdvertisement from "./advertisement/NewAdvertisement"
import TradeList from './trade/TradeList'
import MyAds from './advertisement/MyAds'

class Home extends Component {
  constructor(props) {
    super(props);

    this.state = {
    
    }
  }

  filterUserAds = () => {
    let ads = [];

    if (this.props.user !== undefined && Object.values(this.props.user).length !== 0) {
      const id = this.props.user.info.id
      ads = Object.values(this.props.advertisements).filter(function (ad) {
        return ad.userId === id;
      });
    }
    return ads;
  }

  render() {
    return (
      <React.Fragment>
        <div className="container" style={{ background: "#e9ebee" }}>
          <Navbar search={this.props.search} user={this.props.user} />
          <Switch>
            <Route exact path="/" render={(props) => <Marketplace {...props} reRender={this.props.reRender} adsList={this.props.sug} user={this.props.user} categories={this.props.categories} subCategories={this.props.subCategories} conditions={this.props.conditions} />} />
            <Route path="/tradeRequests" render={(props) => <TradeList {...props} reRender={this.props.reRender} user={this.props.user} />} />
            <Route path="/myAds" render={(props) => <MyAds {...props} reRender={this.props.reRender} user={this.props.user} getAds={this.filterUserAds} categories={this.props.categories} subCategories={this.props.subCategories} conditions={this.props.conditions} />} />
            <Route path="/adDetails/:id" component={AdDetails} />
            <Route path="/newAdvertisement" render={(props) => <NewAdvertisement {...props} reRender={this.props.reRender} user={this.props.user} categories={this.props.categories} subCategories={this.props.subCategories} conditions={this.props.conditions} />} />
            <Route component={PageNotFound} />
          </Switch>
          <Footer />
        </div>
      </React.Fragment>
    );
  }
}

export default Home;