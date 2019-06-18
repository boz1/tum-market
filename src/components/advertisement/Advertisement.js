import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import Card from 'react-bootstrap/Card';
import Image from 'react-image-resizer';

export default class Advertisement extends Component {
    constructor(props) {
        super(props)
        this.state = {
        }
    }

    render() {
        return (
            <Card style={{ width: '18rem', height: 'fit-content' }}>
                <Link to={{ pathname: '/adDetails/' + this.props.ad.id, state: { ad: this.props.ad} }}><Image
                    src={this.props.ad.image}
                    height={240}
                /></Link>
                {/* <Card.Img variant="top" src={this.props.ad.image} alt={this.props.ad.title} /> */}
                <Card.Body className="p-2">
                    <hr></hr>
                    <Card.Title className="text-ad-title">{this.props.ad.title}</Card.Title>
                    <Card.Text>
                        {this.props.ad.mainCategory}
                    </Card.Text>
                    <Card.Text className="bold">
                    <span className="text-premium">{this.props.ad.price + " €"}</span>  {(this.props.ad.trade ? <span className="text-trade">Trade</span> : "")}
                    </Card.Text>
                </Card.Body>
            </Card>
        )
    }
}