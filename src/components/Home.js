import React, { Component } from 'react';
import fire from '../Config/fire-config';

class Home extends Component {
    constructor(props) {
        super(props);
        this.logout = this.logout.bind(this);
    }


    logout() {
        fire.auth().signOut();
    }

    render() {
        return (<h1>Home</h1>);

    }

}

export default Home;