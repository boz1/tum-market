import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import firebase from '../config/firebaseConfig';
import logo from '../assests/logo.svg'
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import FormControl from 'react-bootstrap/FormControl';
import Dropdown from 'react-bootstrap/Dropdown';
import history from '../history'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faBell } from '@fortawesome/free-solid-svg-icons'
import { faTimes } from '@fortawesome/free-solid-svg-icons'


export default class Navbar extends Component {
    constructor(props) {
        super(props)
        this.state = {
            notifications: [],
            notificationIds: [],
            isRead: true
        }

        this.logout = this.logout.bind(this)
        this.readNotifications = this.readNotifications.bind(this)
        this.getNotification = this.getNotification.bind(this)
        this.deleteNotification = this.deleteNotification.bind(this)
    }

    componentWillUnmount() {
        if (this.notifRef !== undefined) {
            this.notifRef.off('value')
            this.notifRef = null;
        }

        if (this.removeNotifRef !== undefined) {
            this.removeNotifRef.off('value')
            this.removeNotifRef = null;
        }

        if (this.notifReadRef !== undefined) {
            this.notifReadRef.off('value')
            this.notifReadRef = null;
        }
    }

    componentWillReceiveProps() {
        if (this.props.user !== undefined && this.props.user.info !== undefined) {
            this.notifRef = firebase.database().ref('notifications').child(this.props.user.info.id)
            this.notifRef.on('child_added', snap => {
                let id = snap.val().id;
                if (!this.state.notificationIds.includes(id)) {
                    let isRead = snap.val().isRead;
                    let notification = snap.val();
                    let idObj = this.state.notificationIds;
                    let notifObj = this.state.notifications;
                    idObj.push(id);
                    notifObj.push(notification)
                    this.setState({
                        notifications: notifObj,
                        notificationIds: idObj,
                        isRead: isRead
                    })
                }
            })
        }
    }

    logout() {
        firebase.auth().signOut();
        history.push('/')
    }

    readNotifications() {
        if (this.props.user !== undefined && this.props.user.info !== undefined && !this.state.isRead) {
            this.notifReadRef = firebase.database().ref('notifications').child(this.props.user.info.id).orderByChild('isRead').equalTo(false)
            this.notifReadRef.on('value', function (snap) {
                snap.forEach(function (notification) {
                    notification.ref.update({ isRead: true });
                });
            });

            this.setState({
                isRead: true
            })
        }
    }

    getNotification(notification) {
        return <span>
            <div className="d-flex" style={{ padding: "0.5rem" }}>
                <Link to={{ pathname: '/tradeRequests' }} className="dropdown-item" style={{ padding: "0.75rem" }}>{notification.message} </Link>
                <div className="m-auto">
                    <span className="float-right offer-reject" style={{ cursor: "pointer" }} onClick={this.deleteNotification} data-notification={notification.id}><FontAwesomeIcon icon={faTimes} /></span>
                </div>
            </div>
            <hr style={{ margin: "0rem 0rem" }}></hr>
        </span>
    }

    deleteNotification(e) {
        if (this.props.user !== undefined && this.props.user.info !== undefined) {
            let id = e.currentTarget.dataset.notification;
            let ids = [];
            let notifications = [];

            this.state.notificationIds.forEach(function(notifId){
                if(notifId !== id){
                    ids.push(notifId)
                }
            })

            this.state.notifications.forEach(function(notif){
                if(notif.id !== id){
                    notifications.push(notif)
                }
            })


            this.setState({
                notificationIds: ids,
                notifications: notifications
            })

            this.removeNotifRef = firebase.database().ref('notifications').child(this.props.user.info.id).child(id).remove();
        }
    }

    render() {
        const user = this.props.user;
        let notifications = [];
        let bell;

        if (!this.state.isRead) {
            bell = <span style={{ fontSize: "18px", color: "crimson" }}><FontAwesomeIcon icon={faBell} /></span>
        }
        else {
            bell = <span style={{ fontSize: "18px" }}><FontAwesomeIcon icon={faBell} /></span>
        }

        if (this.state.notificationIds.length > 0) {
            this.state.notifications.map((notif) => notifications.push(<span key={notif.id}>{this.getNotification(notif)}</span>))
        }
        else {
            notifications.push(<Dropdown.Item key={'no-notif-key'} disabled>No notifications.</Dropdown.Item>)
        }

        return (
            <nav className="navbar navbar-expand-sm px-sm-5 nav-back">
                <Link to='/'>
                    <img src={logo} alt="Tum Market" className="navbar-brand img-responsive" style={{ width: "55px" }} />
                </Link>
                <ul className="navbar-nav align-items-center">
                    <li className="nav-item ml-5">
                        <Link to="/newAdvertisement" className="text-new-ad">New Advertisement</Link>
                    </li>
                </ul>
                <div className="ml-auto">
                    <Form inline>
                        <FormControl onChange={this.props.search} placeholder="Type in Title, Item No, ..." className="mr-sm-2 search" />
                    </Form>
                </div>
                <span className="ml-auto">
                    <Dropdown onToggle={this.readNotifications}>
                        <Dropdown.Toggle variant="info" id="dropdown-basic" >
                            {bell}
                        </Dropdown.Toggle>
                        <div >

                        </div>
                        <Dropdown.Menu alignRight className="p-0">
                            {notifications}
                        </Dropdown.Menu>
                    </Dropdown>
                </span>
                <span></span>
                <Dropdown className="ml-auto">
                    <Dropdown.Toggle variant="primary" id="dropdown-basic">
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