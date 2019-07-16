import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import Card from 'react-bootstrap/Card';

export default class Advertisement extends Component {
    constructor(props) {
        super(props)
        this.state = {
        }
    }


    render() {
        let isPremium = false;
        if (this.props.ad.user.isPremium) {
            isPremium = true;
        }
        return (
            <div>
                <Card style={{ width: '15rem', marginBottom: "10px" }} className={isPremium ? "premium" : ""}>
                        <Link to={{ pathname: '/adDetails/' + this.props.ad.id, state: { ad: this.props.ad, user: this.props.user, categories: this.props.categories, subCategories: this.props.subCategories, conditions: this.props.conditions}, func: this.props.reRender }} className="my-3 mx-auto">
                            <img
                                src={this.props.ad.image}
                                style={{ height: "150px", maxWidth: "180px"}}
                                alt="Product"
                            />
                        </Link>
                        <Card.Body className="p-2">
                            <hr></hr>
                            <Card.Title className="text-ad-title">{this.props.ad.title}</Card.Title>
                            <Card.Text>
                                {this.props.ad.mainCategory.title}
                            </Card.Text>
                            <Card.Text className="bold">
                                <span className="text-premium">{this.props.ad.price + " €"}</span>  {(this.props.ad.trade ? <span className="text-trade">Trade</span> : "")}
                            </Card.Text>
                        </Card.Body>
                    </Card>
            </div>
        )
    }
}