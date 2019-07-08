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
                <Card style={{ width: '15rem', marginBottom: "10px" }} className={isPremium ? "premium" : ""}>
                        <Link to={{ pathname: '/buyDetails/' + this.props.buyingRequest.id, state: { buyingRequest: this.props.buyingRequest, user: this.props.user, categories: this.props.categories, subCategories: this.props.subCategories}, func: this.props.reRender }} className="my-3 mx-auto">
                            
                        <Card.Body className="p-2">
                            <hr></hr>
                            <Card.Title className="text-ad-title">{this.props.buyingRequest.title}</Card.Title>
                            <Card.Text>
                                {this.props.buyingRequest.mainCategory.title}
                            </Card.Text>
                            <Card.Text className="bold">
                                <span className="text-premium">{this.props.buyingRequest.price + " €"}</span>
                            </Card.Text>
                        </Card.Body>
                        </Link>

                    </Card>
            </div>
        )
    }
}