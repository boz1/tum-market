import React, { Component } from 'react'
import firebase from '../../config/firebaseConfig';
import Card from 'react-bootstrap/Card';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCheck } from '@fortawesome/free-solid-svg-icons'
import { faTimes } from '@fortawesome/free-solid-svg-icons'

export default class TradeRequest extends Component {
    constructor(props) {
        super(props)
        this.state = {
            receivedItem: {},
            sentItem: {},
            otherParty: {},
            showStatusModal: false,
            showDeleteModal: false,
            statusAction: '',
            status: this.props.item.status
        }

        this.setItems = this.setItems.bind(this)

        this.showStatusModal = this.showStatusModal.bind(this)
        this.handleClose = this.handleClose.bind(this)
        this.handleSubmit = this.handleSubmit.bind(this)

        this.showDeleteModal = this.showDeleteModal.bind(this)
        this.handleDeleteClose = this.handleDeleteClose.bind(this)
        this.handleDeleteSubmit = this.handleDeleteSubmit.bind(this)
    }

    componentDidMount() {
        this.setItems()
    }

    componentWillUnmount() {
        this.receivedRef.off('value')
        this.receivedRef = null;

        this.sentItemRef.off('value')
        this.sentItemRef = null;

        this.otherPartyRef.off('value')
        this.otherPartyRef = null;
    }

    setItems() {
        const item = this.props.item;

        if (this.props.type === "received") {
            this.receivedRef = firebase.database().ref('advertisements').child(item.buyerId).child(item.receivedItemId)
            this.receivedRef.on('value', snap => {
                this.setState({
                    receivedItem: snap.val()
                })
            })

            this.sentItemRef = firebase.database().ref('advertisements').child(item.userId).child(item.sentItemId)
            this.sentItemRef.on('value', snap => {
                this.setState({
                    sentItem: snap.val()
                })
            })

            this.otherPartyRef = firebase.database().ref('users').child(item.buyerId)
            this.otherPartyRef.on('value', snap => {
                this.setState({
                    otherParty: snap.val()
                })
            })
        }

        if (this.props.type === "sent") {
            this.receivedRef = firebase.database().ref('advertisements').child(item.sellerId).child(item.targetItemId)
            this.receivedRef.on('value', snap => {
                this.setState({
                    receivedItem: snap.val()
                })
            })

            this.sentItemRef = firebase.database().ref('advertisements').child(item.userId).child(item.offeredItemId)
            this.sentItemRef.on('value', snap => {
                this.setState({
                    sentItem: snap.val()
                })
            })

            this.otherPartyRef = firebase.database().ref('users').child(item.sellerId)
            this.otherPartyRef.on('value', snap => {
                this.setState({
                    otherParty: snap.val()
                })
            })

            this.setState({
                status: this.props.item.status
            })
        }
    }

    showDeleteModal() {
        this.setState({
            showDeleteModal: true
        })
    }

    handleDeleteClose() {
        this.setState({ showDeleteModal: false });
    }

    handleDeleteSubmit() {
        this.setState({
            showDeleteModal: false
        });

        // Get a key for a new Post.
        var newPostKey = firebase.database().ref('notifications').child(this.props.item.sellerId).push().key;
        const notification = {
            id: newPostKey,
            message: this.props.user.name + " has deleted their trade request for your " + this.state.receivedItem.title + ".",
            isRead: false
        };

        // Get a key for a new Post.
        var updates = {};
        updates['/notifications/' + this.props.item.sellerId + '/' + newPostKey] = notification;
        firebase.database().ref().update(updates);

        this.removeTradeReqRef = firebase.database().ref('trade-requests').child(this.props.item.userId).child(this.props.item.id).remove();
        this.removeReceivedOffRef = firebase.database().ref('received-offers').child(this.props.item.sellerId).child(this.props.item.id).remove();
    }

    showStatusModal(e) {
        this.setState({
            showStatusModal: true,
            statusAction: e.currentTarget.dataset.span
        })
    }

    handleClose() {
        this.setState({ showStatusModal: false });
    }

    handleSubmit(e) {
        this.setState({
            showStatusModal: false,
            status: e.target.value
        });

        // Get a key for a new Post.
        var newPostKey = firebase.database().ref('notifications').child(this.props.item.buyerId).push().key;

        const notification = {
            id: newPostKey,
            message: this.props.user.name + " has " + this.state.statusAction.toLowerCase() + " your trade request for " + this.state.sentItem.title + ".",
            isRead: false
        };

        // Get a key for a new Post.
        var updates = {};
        updates['/trade-requests/' + this.props.item.buyerId + '/' + this.props.item.id + '/status'] = e.target.value;
        updates['/received-offers/' + this.props.item.userId + '/' + this.props.item.id + '/status'] = e.target.value;
        updates['/notifications/' + this.props.item.buyerId + '/' + newPostKey] = notification;

        firebase.database().ref().update(updates);
    }

    render() {
        const item = this.props.item;
        const type = this.props.type;
        let request, receivedStatus, sentStatus, statusUpdateModal, deleteModal, statusAction;

        if (this.state.statusAction === "Accepted") {
            statusAction = "accept"
        } else {
            statusAction = "reject"
        }

        statusUpdateModal = <Modal show={this.state.showStatusModal} onHide={this.handleClose}>
            <Modal.Body style={{ fontSize: '16px' }}>
                Do you want to <strong>{statusAction}</strong> this offer?
                  </Modal.Body>
            <Modal.Footer>
                <Button variant="danger" onClick={this.handleClose}>
                    Close
                </Button>
                <Button variant="success" onClick={this.handleSubmit} value={this.state.statusAction}>
                    Confirm
                </Button>
            </Modal.Footer>
        </Modal>

        deleteModal = <Modal show={this.state.showDeleteModal} onHide={this.handleClose}>
            <Modal.Body style={{ fontSize: '16px' }}>
                Do you want to delete this request?
            </Modal.Body>
            <Modal.Footer>
                <Button variant="danger" onClick={this.handleDeleteClose}>
                    Close
                </Button>
                <Button variant="success" onClick={this.handleDeleteSubmit}>
                    Confirm
                </Button>
            </Modal.Footer>
        </Modal>

        if (this.state.status === "Accepted") {
            receivedStatus =
                <span>
                    <span className="float-right offer-accept ml-3 accepted"><FontAwesomeIcon icon={faCheck} /></span>
                    <span className="float-right offer-reject" style={{ cursor: "pointer" }} onClick={this.showStatusModal} data-span="Rejected"><FontAwesomeIcon icon={faTimes} /></span>
                </span>
        }
        else if (this.state.status === "Rejected") {
            receivedStatus =
                <span>
                    <span className="float-right offer-accept ml-3" style={{ cursor: "pointer" }} onClick={this.showStatusModal} data-span="Accepted"><FontAwesomeIcon icon={faCheck} /></span>
                    <span className="float-right offer-reject rejected"><FontAwesomeIcon icon={faTimes} /></span>
                </span>
        }
        else {
            receivedStatus =
                <span>
                    <span className="float-right offer-accept ml-3" style={{ cursor: "pointer" }} onClick={this.showStatusModal} data-span="Accepted"><FontAwesomeIcon icon={faCheck} /></span>
                    <span className="float-right offer-reject" style={{ cursor: "pointer" }} onClick={this.showStatusModal} data-span="Rejected"><FontAwesomeIcon icon={faTimes} /></span>
                </span>
        }

        sentStatus = <span className="float-right offer-reject" style={{ cursor: "pointer" }} onClick={this.showDeleteModal}><FontAwesomeIcon icon={faTimes} /></span>

        if (type === "received") {
            request = <Card className="w-100 h-auto">
                <Card.Header>
                    <span className="text-sub-title" style={{ color: "coral" }}>Received Offer
                        {receivedStatus}
                    </span>
                </Card.Header>
                <Card.Body style={{ background: "#FFE7DF" }}>
                    <Card.Text>
                        You Receive: <strong>{this.state.receivedItem.title} - ID {this.state.receivedItem.id}</strong>
                    </Card.Text>
                    <Card.Text>
                        You Send: <strong>{this.state.sentItem.title}  - ID {this.state.sentItem.id}</strong>
                    </Card.Text>
                    <Card.Text>
                        From: <strong>{this.state.otherParty.name} - {this.state.otherParty.email}</strong>
                    </Card.Text>
                    <Card.Text>
                        Status: <strong>{item.status}</strong>
                    </Card.Text>
                    <Card.Text>
                        Date: <strong>{item.date.split(" ")[0]}</strong>
                    </Card.Text>
                </Card.Body>
            </Card>
        }
        else if (type === "sent") {
            request = <Card className="w-100 h-auto mt-2">
                <Card.Header>
                    <span className="text-sub-title" style={{ color: "#3DA09B" }}>Sent Offer
                        {sentStatus}
                    </span>
                </Card.Header>
                <Card.Body style={{ background: "#DBEDEC" }}>
                    <Card.Text>
                        You Receive: <strong>{this.state.receivedItem.title} - ID {this.state.receivedItem.id}</strong>
                    </Card.Text>
                    <Card.Text>
                        You Send: <strong>{this.state.sentItem.title}  - ID {this.state.sentItem.id}</strong>
                    </Card.Text>
                    <Card.Text>
                        To: <strong>{this.state.otherParty.name} - {this.state.otherParty.email}</strong>
                    </Card.Text>
                    <Card.Text>
                        Status: <strong>{item.status}</strong>
                    </Card.Text>
                    <Card.Text>
                        Date: <strong>{item.date.split(" ")[0]}</strong>
                    </Card.Text>
                </Card.Body>
            </Card >
        }

        return (
            <div className="mr-2">
                {deleteModal}
                {statusUpdateModal}
                {request}
            </div>
        )
    }
}
