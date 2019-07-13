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
import NotificationService from '../services/NotificationService'
import AuthService from '../services/AuthService';


export default class Navbar extends Component {
    constructor(props) {
        super(props)
        this.state = {
            notifications: [],
            notificationIds: [],
            isRead: true,
            notReadNotificationCount: 0,
            search: ""
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
    }

    componentWillReceiveProps() {
        if (this.props.user !== undefined && this.props.user.info !== undefined) {
            this.notifRef = firebase.database().ref('notifications').child(this.props.user.info.id)
            this.notifRef.on('child_added', snap => {
                let id = snap.val().id;
                if (!this.state.notificationIds.includes(id)) {
                    let isRead = snap.val().isRead;
                    let notReadNotifCount = this.state.notReadNotificationCount;
                    let notification = snap.val();
                    let idObj = this.state.notificationIds;
                    let notifObj = this.state.notifications;
                    idObj.push(id);
                    notifObj.push(notification)
                    if (!isRead) {
                        notReadNotifCount++;
                        this.setState({
                            notifications: notifObj,
                            notificationIds: idObj,
                            isRead: isRead,
                            notReadNotificationCount: notReadNotifCount
                        })
                    }
                    else {
                        this.setState({
                            notifications: notifObj,
                            notificationIds: idObj,
                            notReadNotificationCount: notReadNotifCount
                        })
                    }
                }
            })
        }
    }

    logout() {
        AuthService.logout(this.state.email, this.state.password).then((data) => {
            window.location.reload();
        })
            .catch((er) => {
                console.log(er)
            })
    }

    readNotifications(isShown) {
        if (this.props.user !== undefined && this.props.user.info !== undefined && !this.state.isRead) {
            NotificationService.readNotifications(this.props.user.info.id).then((msg) => {
                let notifications = this.state.notifications;
                let isRead = this.state.isRead;

                if (!isShown) {
                    notifications.forEach(function (notification) {
                        if (!notification.isRead) {
                            notification.isRead = true;
                        }
                    })
                    isRead = true;
                }

                this.setState({
                    isRead: isRead,
                    notReadNotificationCount: 0,
                    notifications: notifications
                })

                this.props.reRender()
            }).catch((e) => {
                console.log(e);
            });
        }
    }

    getNotification(notification) {
        let notificationContainer;

        if (notification.isRead) {
            notificationContainer =
                <Link to={{ pathname: '/tradeRequests' }} className="dropdown-item" style={{ padding: "0.75rem" }}>{notification.message}</Link>
        }
        else {
            notificationContainer =
                <Link to={{ pathname: '/tradeRequests' }} className="dropdown-item" style={{ padding: "0.75rem", background: "#C7DCF2" }}>{notification.message}</Link>
        }
        return <span>
            <div className="d-flex" style={{ padding: "0.5rem" }}>
                {notificationContainer}
                <div className="m-auto pl-2 pr-2">
                    <span className="float-right offer-reject" style={{ cursor: "pointer" }} onClick={this.deleteNotification} data-notification={notification.id}>
                        <FontAwesomeIcon icon={faTimes} />
                    </span>
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

            this.state.notificationIds.forEach(function (notifId) {
                if (notifId !== id) {
                    ids.push(notifId)
                }
            })

            this.state.notifications.forEach(function (notif) {
                if (notif.id !== id) {
                    notifications.push(notif)
                }
            })

            let notifCount = this.state.notReadNotificationCount - 1;

            if (notifCount < 0) {
                notifCount = 0;
            }

            this.setState({
                notificationIds: ids,
                notifications: notifications,
                notReadNotificationCount: notifCount
            })

            NotificationService.deleteNotification(this.props.user.info.id, id).then((msg) => {
            }).catch((e) => {
                console.log(e);
            });

        }
    }

    refresh = (e) => {
        this.props.changeMarket('sell')
        history.push('/')
    }

    reset = (e) => {
        this.props.reRender();
        this.setState({ [e.target.name]: "" });
    }

    render() {
        const user = this.props.user;
        let notifications = [];
        let bell, notificationCounter;

        if (!this.state.isRead) {
            bell = <span style={{ fontSize: "18px" }}><FontAwesomeIcon icon={faBell} /></span>
            notificationCounter = <span style={{ fontSize: "18px", color: "#dc3545" }}>
                {this.state.notReadNotificationCount}
            </span>
        }
        else {
            bell = <span style={{ fontSize: "18px" }}><FontAwesomeIcon icon={faBell} /></span>
        }

        if (this.state.notificationIds.length > 0) {
            this.state.notifications.slice(0).map((notif) => notifications.push(<span key={notif.id}>{this.getNotification(notif)}</span>))
        }
        else {
            notifications.push(<Dropdown.Item key={'no-notif-key'} disabled>No notifications.</Dropdown.Item>)
        }

        return (
            <nav className="navbar navbar-expand-sm px-sm-5 nav-back">
                <span onClick={this.refresh} style={{ cursor: "pointer" }}>
                    <img src={logo} alt="Tum Market" className="navbar-brand img-responsive" style={{ width: "55px" }} />
                </span>
                <ul className="navbar-nav align-items-center">
                    <li className="nav-item ml-5">
                        <Link to="/newAdvertisement" className="text-new-ad text-decoration-none">New Advertisement</Link>
                    </li>
                </ul>
                <div className="ml-auto">
                    <Form inline>
                        <FormControl name="search" onChange={this.props.search} placeholder="Type in Product Title..." className="mr-sm-2 search" />
                        <Button type="reset" onClick={this.reset} variant="danger" className="mr-1">Clear</Button>
                        <Button type="submit">Filter</Button>
                    </Form>
                </div>

                <span className="ml-auto d-flex">
                    {notificationCounter}
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
                    <Dropdown.Toggle variant="info" id="dropdown-basic">
                        {user !== undefined && user.info !== undefined ? user.info.name : ""}
                    </Dropdown.Toggle>
                    <Dropdown.Menu alignRight>
                        <Dropdown.Item href="#/action-1">Profile</Dropdown.Item>
                        <Link to={{ pathname: '/myAds' }} className="dropdown-item">My Advertisements</Link>
                        <Link to={{ pathname: '/myBuy' }} className="dropdown-item">My Buying Requests</Link>
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