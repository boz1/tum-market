import React, { Component } from 'react'
import Title from '../Title'
import Card from 'react-bootstrap/Card';
import Image from 'react-image-resizer';

export default class AdDetails extends Component {
    constructor(props) {
        super(props)
        this.state = {
        }
    }

    render() {
        const ad = this.props.location.state.ad;
        return (
            <React.Fragment>
                <div className="container">
                    <Title title={ad.title} />
                    <hr></hr>
                    <div className="row">
                        <div className="col-md-12 d-flex p-0">
                            <div className="col-md-8">
                                <span className="text-sub-title">Details</span>
                                <div className="d-flex mt-2 col-sm-12 p-0">
                                    <div className="col-sm-6">
                                    <Image
                                        src={ad.image}
                                        height={240}
                                        width={300}
                                    />
                                    </div>
                                    
                                    <div className="col-sm-6 p-0">
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
                            </div>
                            <div className="col-md-4">
                                <span className="text-sub-title">Contact</span>
                            </div>
                        </div>
                    </div>
                    <div className="row my-4">
                        <div className="col-md-8">
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
                </div>
            </React.Fragment>
        )
    }
}
