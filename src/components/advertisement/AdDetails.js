import React, { Component } from 'react'
import firebase, {storage} from '../../config/firebaseConfig';
import Title from '../Title'
import Card from 'react-bootstrap/Card';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Alert from 'react-bootstrap/Alert';
import history from '../../history'
import Edit from './Edit';
import Modal from 'react-bootstrap/Modal';
import { css } from '@emotion/core';
import { RingLoader } from 'react-spinners';
import ConfirmationModal from '../ConfirmationModal'

const override = css`
    display: block;
    margin: 0 auto;
    border-color: red;
`;

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
            showEditModal: false,
            isEditable: true,
            loading: false
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
        this.setState({
            loading: true,
        })

        const ad = this.props.location.state.ad;

        this.checkAdSentReq(ad).then(reqs => {
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
        }).catch(er => {
            console.log(er)
        })

        this.checkAdReceivedReq(ad).then(reqs => {
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
        }).catch(er => {
            console.log(er)
        })

        firebase.database().ref('advertisements').child(ad.userId).child(ad.id).remove();

        const deleteImageRef = storage.ref(`images/${ad.userId}/${ad.id}/${ad.imageTitle}`)
        
        // Delete the file
        deleteImageRef.delete().then(function () {
            history.push('/')
        }).catch(function (error) {
            console.log(error)
        });
    }

    checkAdSentReq = (ad) => {
        return new Promise(function (res, rej) {
            const checkTradeReqRef = firebase.database().ref('trade-requests').child(ad.userId).orderByChild("offeredItemId").equalTo(ad.id)
            checkTradeReqRef.once('value').then(snap => {
                if (snap.val() !== null) {
                    const reqs = Object.values(snap.val())
                    res(reqs);
                } else {
                    res([]);
                }
            }).catch(er => {
                rej(er)
            })
        })
    }

    checkAdReceivedReq = (ad) => {
        return new Promise(function (res, rej) {
            const checkReceivedReqRef = firebase.database().ref('received-offers').child(ad.userId).orderByChild("sentItemId").equalTo(ad.id)
            checkReceivedReqRef.once('value').then(snap => {
                if (snap.val() !== null) {
                    const reqs = Object.values(snap.val())
                    res(reqs);
                } else {
                    res([]);
                }
            }).catch(er => {
                rej(er)
            })
        })
    }

    showDeleteModal = (e) => {
        e.preventDefault();
        this.setState({ showDeleteModal: true })
    }

    showEditModal = (e) => {
        e.preventDefault();
        const ad = this.props.location.state.ad;

        const req = this.checkAdSentReq(ad)
        req.then(reqs => {
            if (reqs.length > 0) {
                this.setState({
                    isEditable: false
                })
            } else {
                const req2 = this.checkAdReceivedReq(ad);
                req2.then(reqs => {
                    if (reqs.length > 0) {
                        this.setState({
                            isEditable: false
                        })
                    }
                    else {
                        this.setState({
                            showEditModal: true
                        })
                    }
                })
            }
        }).catch(er => {
            console.log(er)
        })
    }

    handleClose() {
        this.setState({ showModal: false, showDeleteModal: false, showEditModal: false });
    }

    render() {
        const ad = this.props.location.state.ad;
        const adOwner = ad.user;
        const user = this.props.location.state.user;
        let actionField;
        
        let loading = <Modal show={this.state.loading}>
            <Modal.Body>
                <RingLoader
                    css={override}
                    sizeUnit={"px"}
                    size={100}
                    color={'#006BD6'}
                    loading={this.state.loading}
                />
            </Modal.Body>
        </Modal>

        let items = [];
        items.push(<option key="empty" disabled value={''}>Choose...</option>)

        if (user.ads !== null & user.ads !== undefined) {
            Object.values(user.ads).map((item) => items.push(<option key={item.id} value={item.title + '&' + item.id}>{item.title}</option>))
        }

        const confTxt = <span>You are offering <strong>{this.state.offeredItem.split('&')[0]}</strong> for {adOwner.name}'s <strong>{ad.title}</strong>. Do you want to send this trade request?"</span>
        const modal = <ConfirmationModal show={this.state.showModal} onHide={this.handleClose} title="Trade Request" txt={confTxt} onClickClose={this.handleClose} onClickConfirm={this.handleSubmit} />

        const delTxt = <span>Deleting this advertisement will also <strong>delete any trade request this item has been used</strong>. Are you sure to delete this advertisement?</span>
        const deleteModal = <span><ConfirmationModal show={this.state.showDeleteModal} onHide={this.handleClose} title="Delete Advertisement" txt={delTxt} onClickClose={this.handleClose} onClickConfirm={this.handleDelete} />
        {loading}</span>

        const editModal = <Edit show={this.state.showEditModal} close={this.handleClose} user={this.props.location.state.user} ad={this.props.location.state.ad} categories={this.props.location.state.categories} subCategories={this.props.location.state.subCategories} conditions={this.props.location.state.conditions} />
        const editAlert = <Alert show={!this.state.isEditable} variant={"danger"} style={{ marginTop: "10px" }} >
            This item can't be edited since it is used in a trade request.
        </Alert>

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
                    <Card.Body className="d-block m-auto">
                        <div>
                            {editAlert}
                        </div>
                        <div>
                            <Button variant="danger" type="submit" onClick={this.showDeleteModal}>
                                Delete
                            </Button>
                            <Button variant="primary" type="submit" className="float-right ml-5" onClick={this.showEditModal} disabled={!this.state.isEditable}>
                                Edit
                            </Button>
                        </div>
                    </Card.Body>
                </Card>
            </div>;
        }

        const requestSentAlert = <Alert show={this.state.showAlert} variant={"success"} style={{ width: '18rem', marginTop: "10px" }} >
            Your trade offer is sent.
          </Alert>

        const alreadyAlert = <Alert show={this.state.isAlreadyOffered} variant={"info"} style={{ width: '18rem', marginTop: "10px" }} >
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
                                            <li className="center-item"><span className="float-left">Date Added</span><strong>{ad.dateAdded.split(' ')[0]}</strong></li>
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
