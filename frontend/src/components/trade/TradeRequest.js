import React, { Component } from 'react'
import Card from 'react-bootstrap/Card';
import ConfirmationModal from '../ConfirmationModal'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCheck } from '@fortawesome/free-solid-svg-icons'
import { faTimes } from '@fortawesome/free-solid-svg-icons'
import TradeService from '../../services/TradeService'

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

    setItems() {
        const item = this.props.item;

        if (this.props.type === "received") {
            TradeService.getReceivedItem(item).then((data) => {
                this.setState({
                    receivedItem: data.obj.receivedItem,
                    sentItem: data.obj.sentItem,
                    otherParty: data.obj.otherParty
                })
            }).catch((e) => {
                console.log(e);
            });
        }

        if (this.props.type === "sent") {
            TradeService.getSentItem(item).then((data) => {
                this.setState({
                    receivedItem: data.obj.receivedItem,
                    sentItem: data.obj.sentItem,
                    otherParty: data.obj.otherParty
                })
            }).catch((e) => {
                console.log(e);
            });
        }

        this.setState({
            status: this.props.item.status
        })
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

        let item = this.props.item;
        item.username = this.props.user.name;

        TradeService.deleteSentReq(this.props.item, "req").then((msg) => {
        }).catch((e) => {
            console.log(e);
        });

        this.props.reRender()
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
        });

        TradeService.updateStatus(this.props.item, this.props.user, this.state.sentItem.title, this.state.statusAction).then((msg) => {
        }).catch((e) => {
            console.log(e);
        });

        this.setState({status: this.state.statusAction})

        this.props.reRender()
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

        const updateTxt = <span>Do you want to <strong>{statusAction}</strong> this offer?</span>
        statusUpdateModal = <ConfirmationModal show={this.state.showStatusModal} onHide={this.handleClose} title="Status Update" txt={updateTxt} onClickClose={this.handleClose} onClickConfirm={this.handleSubmit} />

        const txt = <span>Do you want to <strong>delete</strong> this request?</span>
        deleteModal = <ConfirmationModal show={this.state.showDeleteModal} onHide={this.handleClose} title="Delete Request" txt={txt} onClickClose={this.handleDeleteClose} onClickConfirm={this.handleDeleteSubmit} />

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
                        Receive Item: <strong>{this.state.receivedItem.title}</strong>
                    </Card.Text>
                    <Card.Text>
                        Received Item Id: <strong>{this.state.receivedItem.id}</strong>
                    </Card.Text>
                    <Card.Text>
                        Sent Item: <strong>{this.state.sentItem.title}</strong>
                    </Card.Text>
                    <Card.Text>
                        Sent Item Id: <strong>{this.state.sentItem.id}</strong>
                    </Card.Text>
                    <Card.Text>
                        From: <strong>{this.state.otherParty.name} - {this.state.otherParty.email}</strong>
                    </Card.Text>
                    <Card.Text>
                        Status: <strong>{this.state.status}</strong>
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
                        Received Item: <strong>{this.state.receivedItem.title}</strong>
                    </Card.Text>
                    <Card.Text>
                        Received Item Id: <strong>{this.state.receivedItem.id}</strong>
                    </Card.Text>
                    <Card.Text>
                        Sent Item: <strong>{this.state.sentItem.title}</strong>
                    </Card.Text>
                    <Card.Text>
                        Sent Item Id: <strong>{this.state.sentItem.id}</strong>
                    </Card.Text>
                    <Card.Text>
                        To: <strong>{this.state.otherParty.name} - {this.state.otherParty.email}</strong>
                    </Card.Text>
                    <Card.Text>
                        Status: <strong>{this.state.status}</strong>
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
