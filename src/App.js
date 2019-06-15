import React, {Component} from 'react';
import {Switch, Route} from 'react-router-dom'
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
     <React.Fragment>
       <Navbar></Navbar>
       <Colbar></Colbar>
       <Footer/>
       <Switch>
         <Route exact path="/" component={AdvertisementList}/>
         <Route path="/adDetails" component={AdDetails}/>
         <Route path="/newAdvertisement" component={NewAdvertisement}/>
         <Route component={PageNotFound}/>
       </Switch>
     </React.Fragment>
    );
  }
  
}

export default App;
