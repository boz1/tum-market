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
        let premium;

        if(this.props.user.info.isPremium){
            premium = <div style={{textAlign:"center"}} className="text-category-title">Premium</div>
        }

        return (
            <div clas="col-md-4">
                <Card style={{ width: '15rem', marginBottom: "10px" }}>
                    <Link to={{ pathname: '/adDetails/' + this.props.ad.id, state: { ad: this.props.ad, user: this.props.user } }} className="my-3 mx-auto">
                            <img
                                src={this.props.ad.image}
                                style={{ height: "150px" }}
                                alt="Product"
                            />
                    </Link>
                    <Card.Body className="p-2">
                        {premium}
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