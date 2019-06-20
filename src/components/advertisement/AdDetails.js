import React, { Component } from 'react'
import Title from '../Title'
import Card from 'react-bootstrap/Card';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Image from 'react-image-resizer';

export default class AdDetails extends Component {
    constructor(props) {
        super(props)
        this.state = {
            offeredItem : this.props.location.state.user.ads[this.props.location.state.user.ads.length - 1].title
        }

        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleChange(event) {
        this.setState({offeredItem: event.target.value});
    }

    handleSubmit(event){
        event.preventDefault();
        console.log(this.state.offeredItem)
    }

    render() {
        const ad = this.props.location.state.ad;
        const adOwner = ad.user;
        const user = this.props.location.state.user;
        
        let tradeRequest;
        let items = user.ads.map((item) => <option key={item.id} value={item.title}>{item.title}</option>)
        
        if (ad.trade && user.info.id !== ad.userId) {
            tradeRequest = <div className="mt-3">
                <span className="text-sub-title">Trade Request</span>
                <Card style={{ width: '18rem', background: 'whitesmoke' }} className="mt-2">
                    <Card.Body>
                        <Form onSubmit={this.handleSubmit}>
                            <Form.Row>
                                <Form.Group controlId="tradeItem">
                                    <Form.Label style={{fontSize:"16px"}}>Your Items</Form.Label>
                                    <Form.Control as="select" value={this.state.offeredItem} onChange={this.handleChange}>
                                        {items}
                                    </Form.Control>
                                </Form.Group>
                            </Form.Row>
                            <Button type='submit'  variant="primary">
                                Offer
                             </Button>
                        </Form>
                    </Card.Body>
                </Card>
            </div>;
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
                            </div>
                        </div>
                    </div>

                </div>
            </React.Fragment>
        )
    }
}
