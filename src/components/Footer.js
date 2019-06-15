import React, { Component } from 'react';
import Navbar from 'react-bootstrap/Navbar';

export default class Footer extends Component {
    render() {
        return (
            <div>
                <Navbar sticky="bottom" className="nav-back text-link">
                    <div className="ml-3">
                        <span>© Tum Market 2019</span>
                    </div>
                    <div className="mx-auto">
                        <span>About Us</span>
                    </div>
                    <div className="mx-auto">
                        <span>Contact</span>
                    </div>
                    <div className="mx-auto">
                        <span>Terms and Conditions</span>
                    </div>
                </Navbar>
            </div>
        )
    }
}
