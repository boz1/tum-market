import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import logo from '../logo.svg'
import { faBars } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import FormControl from 'react-bootstrap/FormControl';

export default class Navbar extends Component {
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
                <div className="ml-auto mr-auto">
                    <Form inline>
                        <FormControl type="text" placeholder="Type in Title, Item No, ..." className=" mr-sm-2" />
                        <Button type="submit">Filter</Button>
                    </Form>
                </div>
                <button className="ml-auto"><FontAwesomeIcon icon={faBars} /></button>
            </nav>
        )
    }
}
