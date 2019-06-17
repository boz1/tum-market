import React, { Component } from 'react';
import fire from '../Config/fire-config';
import { Switch, Route } from 'react-router-dom'
import Navbar from './Navbar'
import Colbar from './Colbar'
import Footer from './Footer'
import AdvertisementList from './advertisement/AdvertisementList'
import AdDetails from './advertisement/AdDetails'
import PageNotFound from './PageNotFound'
import NewAdvertisement from "./advertisement/NewAdvertisement"
class Home extends Component {
    constructor(props) {
        super(props);
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
          this.logout = this.logout.bind(this);
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
        this.usersRef = fire.database().ref('users')
        this.usersRef.on('value', snap => {
          this.setState({
            usersList: snap.val()
          })
        })
    }
    getAdvertisements() {
        this.adsRef = fire.database().ref('advertisements')
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
        this.categoriesRef = fire.database().ref('categories')
        this.categoriesRef.on('value', snap => {
          this.setState({
            categories: snap.val()
          })
        })
    }
    
    getConditions() {
        this.conditionsRef = fire.database().ref('conditionsRef')
        this.conditionsRef.on('value', snap => {
          this.setState({
            conditions: snap.val()
          })
        })
    }
    logout() {
        fire.auth().signOut();
    }

    render() {
        return (      <React.Fragment>
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
              <button type="submit" onClick={this.logout} class="btn btn-primary">logout</button>
              <Footer />
            </div>
          </React.Fragment>
            );

    }

}

export default Home;