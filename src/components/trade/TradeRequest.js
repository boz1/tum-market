import React, { Component } from 'react'
import firebase from '../../config/firebaseConfig';
import Card from 'react-bootstrap/Card';

export default class TradeRequest extends Component {
    constructor(props) {
        super(props)
        this.state = {
            receivedItem: {},
            sentItem: {},
            otherParty: {}
        }

        this.setItems = this.setItems.bind(this)
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
        }
    }

    render() {
        const item = this.props.item;
        const type = this.props.type;
        let request;

        if (type === "received") {
            request = <Card className="w-100 h-auto">
                <Card.Header><span className="text-sub-title" style={{ color: "coral" }}>Received Offer</span></Card.Header>
                <Card.Body style={{ background: "#FFE7DF" }}>
                    <Card.Text>
                        ID: <strong> {item.id}</strong>
                    </Card.Text>
                    <Card.Text>
                        You Receive: <strong>{this.state.receivedItem.title} - ID {this.state.receivedItem.id}</strong>
                    </Card.Text>
                    <Card.Text>
                        You Send: <strong>{this.state.sentItem.title}  - ID {this.state.sentItem.id}</strong>
                    </Card.Text>
                    <Card.Text>
                        From: <strong>{this.state.otherParty.name} - {this.state.otherParty.email}</strong>
                    </Card.Text>
                </Card.Body>
            </Card>
        }
        else if (type === "sent") {
            request = <Card className="w-100 h-auto mt-2">
                <Card.Header><span className="text-sub-title" style={{ color: "#3DA09B" }}>Sent Offer</span></Card.Header>
                <Card.Body style={{ background: "#DBEDEC" }}>
                    <Card.Text>
                        ID: <strong> {item.id}</strong>
                    </Card.Text>
                    <Card.Text>
                        You Receive: <strong>{this.state.receivedItem.title} - ID {this.state.receivedItem.id}</strong>
                    </Card.Text>
                    <Card.Text>
                        You Send: <strong>{this.state.sentItem.title}  - ID {this.state.sentItem.id}</strong>
                    </Card.Text>
                    <Card.Text>
                        To: <strong>{this.state.otherParty.name} - {this.state.otherParty.email}</strong>
                    </Card.Text>
                </Card.Body>
            </Card>
        }

        return (
            <div className="mr-2">
                {request}
            </div>
        )
    }
}
