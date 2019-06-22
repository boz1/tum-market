import React, { Component } from 'react'
import firebase from '../../config/firebaseConfig';
import Title from '../Title'
import Card from 'react-bootstrap/Card';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Image from 'react-image-resizer';
import Alert from 'react-bootstrap/Alert';

export default class AdDetails extends Component {
    constructor(props) {
        super(props)
        this.state = {
            offeredItem: this.props.location.state.user.ads[2].title + '-' + this.props.location.state.user.ads[2].id,
            isOfferSubmitted: false,
            showAlert: false,
            isAlreadyOffered: false
        }

        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    componentDidMount(){
        const tradeOffers = this.props.location.state.user.tradeReq;
        const ad = this.props.location.state.ad;
        let isOffered = false;

        tradeOffers.forEach(function(trade){
            if(trade.targetItemId === ad.id){
                isOffered = true;
            }
        })

        this.setState({
            isAlreadyOffered : isOffered
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
        const itemId = parseInt(this.state.offeredItem.split('-')[1]);

        // Get a key for a new Post.
        var newPostKey = firebase.database().ref('trade-requests').child(user.info.id).push().key;

        const postDataBuyer = {
            offeredItemId: itemId,
            sellerId: ad.userId,
            targetItemId: ad.id,
            userId: user.info.id,
            id: newPostKey
        };

        const postDataSeller = {
            receivedItemId: itemId,
            userId: ad.userId,
            sentItemId: ad.id,
            buyerId: user.info.id,
            id: newPostKey
        };

        // Write the new post's data simultaneously in the posts list and the user's post list.
        var updates = {};
        updates['/trade-requests/' + user.info.id + '/' + newPostKey] = postDataBuyer;
        updates['/received-offers/' + ad.userId + '/' + newPostKey] = postDataSeller;

        firebase.database().ref().update(updates);

        this.setState({
            isOfferSubmitted: true,
            showAlert: true
        })
    }

    render() {
        const ad = this.props.location.state.ad;
        const adOwner = ad.user;
        const user = this.props.location.state.user;
        let tradeRequest, alert;

        let items = user.ads.map((item) => <option key={item.id} value={item.title + '-' + item.id}>{item.title}</option>)

        if (ad.trade && user.info.id !== ad.userId && !this.state.isOfferSubmitted && !this.state.isAlreadyOffered) {
            tradeRequest = <div className="mt-3">
                <span className="text-sub-title">Trade Request</span>
                <Card style={{ width: '18rem', background: 'whitesmoke' }} className="mt-2">
                    <Card.Body>
                        <Form onSubmit={this.handleSubmit}>
                            <Form.Row>
                                <Form.Group controlId="tradeItem">
                                    <Form.Label style={{ fontSize: "16px" }}>Your Items</Form.Label>
                                    <Form.Control as="select" value={this.state.offeredItem} onChange={this.handleChange}>
                                        {items}
                                    </Form.Control>
                                </Form.Group>
                            </Form.Row>
                            <Button type='submit' variant="primary">
                                Offer
                             </Button>
                        </Form>
                    </Card.Body>
                </Card>
            </div>;
        }

        if (this.state.showAlert) {
            alert = <Alert variant={"success"} style={{ width: '18rem', marginTop: "10px" }} >
                Your trade offer is sent.
          </Alert>
        }
        else if (this.state.isAlreadyOffered){
            alert = <Alert variant={"info"} style={{ width: '18rem', marginTop: "10px" }} >
                You have already sent a trade offer for this item.
          </Alert>
        }

        return (
            <React.Fragment>
                <div className="container">
                    <Title title={ad.title} />
                    <hr className="my-2"></hr>
                    <div className="row">
                        <div className="col-md-12 d-flex p-0">
                            <div className="col-md-8">
                                <span className="text-sub-title">Details</span>
                                <div className="d-flex mt-2 col-sm-12 p-0">
                                    <div className="col-sm-6">
                                        <Image className="mt-0"
                                            src={ad.image}
                                            height={240}
                                            width={300}
                                        />
                                    </div>
                                    <div className="col-sm-6 p-0 mt-3">
                                        <ul className="align-content-center category-list details-list">
                                            <li className="center-item"><span className="float-left">ID</span><strong>{ad.id}</strong></li>
                                            <hr></hr>
                                            <li className="center-item"><span className="float-left">Main Category</span><strong>{ad.mainCategory}</strong></li>
                                            <hr></hr>
                                            <li className="center-item"><span className="float-left">Sub Category</span><strong>{ad.subCategory}</strong></li>
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
                                        <Card.Body>
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
                                            <br></br>
                                            <div className="d-flex bold">
                                                <div>
                                                    {adOwner.telephone}
                                                </div>
                                                <div className="ml-auto">
                                                    {adOwner.email}
                                                </div>
                                            </div>
                                        </Card.Body>
                                    </Card>
                                </div>
                                {tradeRequest}
                                {alert}
                            </div>
                        </div>
                    </div>

                </div>
            </React.Fragment>
        )
    }
}
