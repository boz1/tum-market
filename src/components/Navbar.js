import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import firebase from '../config/firebaseConfig';
import logo from '../logo.svg'
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import FormControl from 'react-bootstrap/FormControl';
import Dropdown from 'react-bootstrap/Dropdown';
import Search from './Search'
export default class Navbar extends Component {
    constructor(props) {
        super(props)
        this.setState = {
            advertisements: this.props.adsList
        }

        this.logout = this.logout.bind(this)
    }

    logout() {
        firebase.auth().signOut();
    }

    render() {
        return (
            <nav className="navbar navbar-expand-sm px-sm-5 nav-back">
                <Link to='/'>
                    <img src={logo} alt="Tum Market" className="navbar-brand img-responsive logo" />
                </Link>
                <ul className="navbar-nav align-items-center">
                    <li className="nav-item ml-5">
                        <Link to="/NewAdvertisement" className="text-new-ad">New Advertisement</Link>
                    </li>
                </ul>
                
                <Search></Search>
                <Dropdown className="ml-auto">
                    <Dropdown.Toggle variant="info" id="dropdown-basic">
                        John Doe
                    </Dropdown.Toggle>
                    <Dropdown.Menu alignRight>
                        <Dropdown.Item href="#/action-1">Profile</Dropdown.Item>
                        <Dropdown.Item href="#/action-2">My Advertisements</Dropdown.Item>
                        <Dropdown.Item href="#/action-3">My Buying Requests</Dropdown.Item>
                        <Dropdown.Item href="#/action-3">My Trade Offers</Dropdown.Item>
                        <Dropdown.Item href="#/action-3">Chat Bot</Dropdown.Item>
                        <Dropdown.Divider />
                        <Dropdown.Item onClick={this.logout}>Log Out</Dropdown.Item>
                    </Dropdown.Menu>
                </Dropdown>
            </nav>
        )
    }
}