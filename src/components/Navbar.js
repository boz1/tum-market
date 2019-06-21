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
        console.log( this.state.advertisements)

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
            </nav>
        )
    }
}