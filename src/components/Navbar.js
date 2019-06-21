import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import firebase from '../config/firebaseConfig';
import logo from '../logo.svg'
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import FormControl from 'react-bootstrap/FormControl';
import Dropdown from 'react-bootstrap/Dropdown';

export default class Navbar extends Component {
    constructor(props) {
        super(props)
        this.state = {
            advertisements: this.props.ad
        }
        this.logout = this.logout.bind(this)
    }

    logout() {
        firebase.auth().signOut();
    }

    render() {
        const user = this.props.user;
        
        return (
            <nav className="navbar navbar-expand-sm px-sm-5 nav-back">
                <Link to='/'>
                    <img src={logo} alt="Tum Market" className="navbar-brand img-responsive logo" />
                </Link>
                <ul className="navbar-nav align-items-center">
                    <li className="nav-item ml-5">
                        <Link to="/newAdvertisement" className="text-new-ad">New Advertisement</Link>
                    </li>
                </ul>
                <div className="ml-auto">
                    <Form inline>
                        <FormControl onChange={this.props.ad} placeholder="Type in Title, Item No, ..." className="mr-sm-2 search" />
                        <Button type="submit">Filter</Button>
                    </Form>
                </div>
                <Dropdown className="ml-auto">
                    <Dropdown.Toggle variant="info" id="dropdown-basic">
                        {user !== undefined && user.info !== undefined ? user.info.name : ""}
                    </Dropdown.Toggle>
                    <Dropdown.Menu alignRight>
                        <Dropdown.Item href="#/action-1">Profile</Dropdown.Item>
                        <Dropdown.Item href="#/action-2">My Advertisements</Dropdown.Item>
                        <Dropdown.Item href="#/action-3">My Buying Requests</Dropdown.Item>
                        <Link to={{ pathname: '/tradeRequests' }} className="dropdown-item">My Trade Requests</Link>
                        <Dropdown.Item href="#/action-3">Chat Bot</Dropdown.Item>
                        <Dropdown.Divider />
                        <Dropdown.Item onClick={this.logout}>Log Out</Dropdown.Item>
                    </Dropdown.Menu>
                </Dropdown>
            </nav>
        )
    }
}