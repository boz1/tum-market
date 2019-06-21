import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import firebase from '../config/firebaseConfig';
import logo from '../logo.svg'
import Dropdown from 'react-bootstrap/Dropdown';
import Search from './Search'
export default class Navbar extends Component {
    constructor(props) {
        super(props)
        this.state = {
            advertisements: this.props.adsList
        }

        this.logout = this.logout.bind(this)
    }

    logout() {
        firebase.auth().signOut();
    }

    render() {
<<<<<<< HEAD
        console.log( this.state.advertisements)
=======
        const user = this.props.user;
>>>>>>> 2a8b8bcc709dafd83f89f9f607bd3745870bd5c2

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
<<<<<<< HEAD
                <Search ad={this.props.adsList}></Search>
    <Dropdown className="ml-auto">
        <Dropdown.Toggle variant="info" id="dropdown-basic">
                        John Doe
            </Dropdown.Toggle>
            <Dropdown.Menu alignRight>
        <form>
       <fieldset>
          <legend>Selecting elements</legend>
             <label>Select list</label>
             <select id = "myList">
               <option value = "1">one</option>
               <option value = "2">two</option>
               <option value = "3">three</option>
               <option value = "4">four</option>
             </select>

            <p> First name:</p>
            <input type="text" name="firstname"></input>
            <p>Last name:</p>
            <input type="text" name="lastname"></input>

                </fieldset>
                </form>
            </Dropdown.Menu>
        </Dropdown>
=======
                <div className="ml-auto">
                    <Form inline>
                        <FormControl type="text" placeholder="Type in Title, Item ID, ..." className="mr-sm-2 search" />
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
>>>>>>> 2a8b8bcc709dafd83f89f9f607bd3745870bd5c2
            </nav>
        )
    }
}