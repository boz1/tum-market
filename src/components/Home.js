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
        return (<div><h1>Home</h1>
            <button type="submit" onClick={this.logout} class="btn btn-primary">logout</button>
                </div>
            );

    }

}

export default Home;