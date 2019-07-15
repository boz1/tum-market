import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import Card from 'react-bootstrap/Card';

export default class BuyingRequest extends Component {
    constructor(props) {
        super(props)
        this.state = {
        }
    }


    render() {
        let isPremium = false;
        if (this.props.buyingRequest.user.isPremium) {
            isPremium = true;
        }
        return (
            <div>
                <Link to={{ pathname: '/buyDetails/' + this.props.buyingRequest.id, state: { buyingRequest: this.props.buyingRequest, user: this.props.user, categories: this.props.categories, subCategories: this.props.subCategories }, func: this.props.reRender }} className="my-3 mx-auto text-decoration-none">
                    <Card style={{ width: '15rem', marginBottom: "10px" }} className={isPremium ? "premium" : ""}>
                        <Card.Body className="p-2">
                            <Card.Title className="card-title">{this.props.buyingRequest.title}</Card.Title>
                            <hr></hr>
                            <Card.Text class="card-subtitle text-right">
                                <span className="float-left">{this.props.buyingRequest.mainCategory.title}</span>
                                <span className="bold text-premium">{this.props.buyingRequest.price + " €"}</span>
                            </Card.Text>
                            <Card.Text className="bold text-right">
                                
                            </Card.Text>
                        </Card.Body>
                    </Card>
                </Link>
            </div>
        )
    }
}