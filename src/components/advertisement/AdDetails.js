import React, { Component } from 'react'
import firebase from '../../config/firebaseConfig';
import Title from '../Title'
import Card from 'react-bootstrap/Card';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Alert from 'react-bootstrap/Alert';
import history from '../../history'
import Edit from './Edit';
import ConfirmationModal from '../ConfirmationModal'

export default class AdDetails extends Component {
    constructor(props) {
        super(props)
        this.state = {
            offeredItem: '',
            isOfferSubmitted: false,
            showAlert: false,
            isAlreadyOffered: false,
            showModal: false,
            showDeleteModal: false,
            showEditModal: false
        }

        this.showRequestModal = this.showRequestModal.bind(this)
        this.handleClose = this.handleClose.bind(this)
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    componentDidMount() {
        const tradeOffers = this.props.location.state.user.tradeReq;
        const ad = this.props.location.state.ad;
        let isOffered = false;

        tradeOffers.forEach(function (trade) {
            if (trade.targetItemId === ad.id) {
                isOffered = true;
            }
        })

        this.setState({
            isAlreadyOffered: isOffered
        })
    }

    componentWillUnmount() {
        if (this.checkTradeReqRef !== undefined) {
            this.checkTradeReqRef.off('value')
            this.checkTradeReqRef = null;
        }

        if (this.checkReceivedReqRef !== undefined) {
            this.checkReceivedReqRef.off('value')
            this.checkReceivedReqRef = null;
        }
    }

    handleChange(event) {
        const title = event.target.value
        this.setState({ offeredItem: title });
    }

    handleSubmit(event) {
        event.preventDefault();
        const ad = this.props.location.state.ad;
        const user = this.props.location.state.user;
        const itemId = this.state.offeredItem.split('&')[1];

        // Get a key for a new Post.
        var newPostKey = firebase.database().ref('trade-requests').child(user.info.id).push().key;

        // Get date
        var today = new Date(),
            date = today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate() + " " + today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();

        const postDataBuyer = {
            offeredItemId: itemId,
            sellerId: ad.userId,
            targetItemId: ad.id,
            userId: user.info.id,
            id: newPostKey,
            status: '-',
            date: date
        };

        const postDataSeller = {
            receivedItemId: itemId,
            userId: ad.userId,
            sentItemId: ad.id,
            buyerId: user.info.id,
            id: newPostKey,
            status: '-',
            date: date
        };

        const notification = {
            id: newPostKey,
            message: "You have a new trade request from " + user.info.name + " for your " + ad.title + ".",
            isRead: false
        };

        var updates = {};
        updates['/trade-requests/' + user.info.id + '/' + newPostKey] = postDataBuyer;
        updates['/received-offers/' + ad.userId + '/' + newPostKey] = postDataSeller;
        updates['/notifications/' + ad.userId + '/' + newPostKey] = notification;

        firebase.database().ref().update(updates);

        this.setState({
            isOfferSubmitted: true,
            showAlert: true,
            showModal: false
        })
    }

    showRequestModal(e) {
        e.preventDefault();

        this.setState({
            showModal: true
        })
    }

    handleDelete = (event) => {
        event.preventDefault()
        const ad = this.props.location.state.ad;
        this.checkTradeReqRef = firebase.database().ref('trade-requests').child(ad.userId).orderByChild("offeredItemId").equalTo(ad.id)
        this.checkTradeReqRef.on('value', snap => {
            if (snap.val() !== null) {
                const reqs = Object.values(snap.val())
                reqs.forEach((req) => {
                    firebase.database().ref('trade-requests').child(ad.userId).child(req.id).remove()
                    firebase.database().ref('received-offers').child(req.sellerId).child(req.id).remove()

                    var newPostKey = firebase.database().ref('notifications').child(req.sellerId).push().key;

                    const notification = {
                        id: newPostKey,
                        message: ad.user.name + " has deleted their " + ad.title + " advertisement. The trade offer sent to you is also deleted.",
                        isRead: false
                    };

                    var updates = {};
                    updates['/notifications/' + req.sellerId + '/' + newPostKey] = notification;
                    firebase.database().ref().update(updates);
                })
            }
        })

        this.checkReceivedReqRef = firebase.database().ref('received-offers').child(ad.userId).orderByChild("sentItemId").equalTo(ad.id)
        this.checkReceivedReqRef.on('value', snap => {
            if (snap.val() !== null) {
                const reqs = Object.values(snap.val())
                reqs.forEach((req) => {
                    firebase.database().ref('received-offers').child(ad.userId).child(req.id).remove()
                    firebase.database().ref('trade-requests').child(req.buyerId).child(req.id).remove()

                    var newPostKey = firebase.database().ref('notifications').child(req.buyerId).push().key;

                    const notification = {
                        id: newPostKey,
                        message: ad.user.name + " has deleted their " + ad.title + " advertisement. The trade offer you sent is also deleted.",
                        isRead: false
                    };

                    var updates = {};
                    updates['/notifications/' + req.buyerId + '/' + newPostKey] = notification;
                    firebase.database().ref().update(updates);
                })
            }
        })

        this.removeAdRef = firebase.database().ref('advertisements').child(ad.userId).child(ad.id).remove();

        this.setState({
            showDeleteModal: false
        })

        history.push('/')
    }

    showDeleteModal = (e) => {
        e.preventDefault();
        this.setState({ showDeleteModal: true })
    }

    showEditModal = (e) => {
        e.preventDefault();
        this.setState({ showEditModal: true })
    }

    handleClose() {
        this.setState({ showModal: false, showDeleteModal: false, showEditModal: false });
    }

    render() {
        const ad = this.props.location.state.ad;
        const adOwner = ad.user;
        const user = this.props.location.state.user;
        let actionField, requestSentAlert, alreadyAlert, modal, deleteModal, editModal;

        let items = [];
        items.push(<option key="empty" disabled value={''}>Choose...</option>)

        if (user.ads !== null & user.ads !== undefined) {
            Object.values(user.ads).map((item) => items.push(<option key={item.id} value={item.title + '&' + item.id}>{item.title}</option>))
        }

        const confTxt = <span>You are offering <strong>{this.state.offeredItem.split('&')[0]}</strong> for {adOwner.name}'s <strong>{ad.title}</strong>.  Do you want to send this trade request?"</span>

        modal = <ConfirmationModal show={this.state.showModal} onHide={this.handleClose} title="Trade Request" txt={confTxt} onClickClose={this.handleClose} onClickConfirm={this.handleSubmit} />

        const delTxt = <span>Deleting this advertisement will also <strong>delete any trade request this item has been used</strong>.
        Are you sure to delete this advertisement?</span>

        deleteModal = <ConfirmationModal show={this.state.showDeleteModal} onHide={this.handleClose} title="Delete Advertisement" txt={delTxt} onClickClose={this.handleClose} onClickConfirm={this.handleDelete} />

        editModal = <Edit show={this.state.showEditModal} close={this.handleClose} categories={this.props.location.state.categories} subCategories={this.props.location.state.subCategories} conditions={this.props.location.state.conditions} />

        if (ad.trade && user.info.id !== ad.userId && !this.state.isOfferSubmitted && !this.state.isAlreadyOffered) {
            actionField = <div className="mt-3">
                <span className="text-sub-title">Trade Request</span>
                <Card style={{ width: '18rem', background: 'whitesmoke' }} className="mt-2">
                    <Card.Body>
                        <Form onSubmit={e => this.showRequestModal(e)}>
                            <Form.Row>
                                <Form.Group controlId="tradeItem">
                                    <Form.Label style={{ fontSize: "16px" }}>Your Items</Form.Label>
                                    <Form.Control required defaultValue={''} as="select" onChange={this.handleChange}>
                                        {items}
                                    </Form.Control>
                                </Form.Group>
                            </Form.Row>
                            <div style={{ marginLeft: "-5px" }}>
                                <Button variant="primary" type="submit" onClick={this.showModal}>
                                    Send Request
                             </Button>
                            </div>
                        </Form>
                    </Card.Body>
                </Card>
            </div >;
        }
        else if (user.info.id === ad.userId) {
            actionField = <div className="mt-3">
                <Card style={{ width: '18rem', background: 'whitesmoke' }} className="mt-2">
                    <Card.Body className="d-flex m-auto">
                        <div className="mr-5">
                            <Button variant="primary" type="submit" className="m-auto" onClick={this.showEditModal}>
                                Edit
                            </Button>
                        </div>
                        <div>
                            <Button variant="danger" type="submit" className="m-auto" onClick={this.showDeleteModal}>
                                Delete
                            </Button>
                        </div>
                    </Card.Body>
                </Card>
            </div>;
        }

        requestSentAlert = <Alert show={this.state.showAlert} variant={"success"} style={{ width: '18rem', marginTop: "10px" }} >
            Your trade offer is sent.
          </Alert>

        alreadyAlert = <Alert show={this.state.isAlreadyOffered} variant={"info"} style={{ width: '18rem', marginTop: "10px" }} >
            You have already sent a trade request for this item.
          </Alert>

        return (
            <React.Fragment>
                <div className="container">
                    <Title title={ad.title} />
                    <hr className="my-2"></hr>
                    <div className="row">
                        <div className="col-md-12 d-flex p-0">
                            <div className="col-md-8">
                                <span className="text-sub-title">Details</span>
                                <div className="d-flex mt-2 col-sm-12 p-0 detail-div">
                                    <div className="col-sm-6 m-auto">
                                        <img src={ad.image} style={{ height: "290px", width: "300px", marginLeft: "12px" }} alt="Product" />
                                    </div>
                                    <div className="col-sm-6 my-3">
                                        <ul className="align-content-center category-list details-list">
                                            <li className="center-item"><span className="float-left">ID</span><strong>{ad.id}</strong></li>
                                            <hr></hr>
                                            <li className="center-item"><span className="float-left">Date</span><strong>{ad.date.split(' ')[0]}</strong></li>
                                            <hr></hr>
                                            <li className="center-item"><span className="float-left">Main Category</span><strong>{ad.mainCategory.title}</strong></li>
                                            <hr></hr>
                                            <li className="center-item"><span className="float-left">Sub Category</span><strong>{ad.subCategory.title}</strong></li>
                                            <hr></hr>
                                            <li className="center-item"><span className="float-left">Condition</span><strong>{ad.condition.title}</strong></li>
                                            <hr></hr>
                                            <li className="center-item"><span className="float-left">Trade</span><strong>{ad.trade ? "Yes" : "No"}</strong></li>
                                            <hr></hr>
                                            <li className="center-item"><span className="float-left">Price</span><strong>{ad.price + " €"}</strong></li>
                                        </ul>
                                    </div>
                                </div>
                                <div className="my-3">
                                    <Card>
                                        <Card.Header><span className="text-sub-title">Description</span></Card.Header>
                                        <Card.Body style={{ fontSize: "16px" }}>
                                            <p>
                                                {' '}
                                                {ad.description}{' '}
                                            </p>
                                        </Card.Body>
                                    </Card>
                                </div>
                            </div>
                            <div className="col-md-4 d-block">
                                <div>
                                    <span className="text-sub-title">Contact</span>
                                    <Card style={{ width: '18rem', background: 'oldlace' }} className="mt-2">
                                        <Card.Body>
                                            <div className="d-flex bold text-premium">
                                                <div>
                                                    <Card.Title >{adOwner.name}</Card.Title>
                                                </div>
                                                <div className="ml-auto">
                                                    {adOwner.isPremium ? "Premium" : ""}
                                                </div>
                                            </div>
                                            <div>
                                                <Card.Text className="d-block mb-1">
                                                    {adOwner.address}
                                                </Card.Text>
                                            </div>
                                            <div className="d-block">
                                                <div>
                                                    {adOwner.telephone}
                                                </div>
                                                <div>
                                                    {adOwner.email}
                                                </div>
                                            </div>
                                        </Card.Body>
                                    </Card>
                                </div>
                                {actionField}
                                {requestSentAlert}
                                {alreadyAlert}
                            </div>
                        </div>
                        {modal}
                        {deleteModal}
                        {editModal}
                    </div>
                </div>
            </React.Fragment>
        )
    }
}
