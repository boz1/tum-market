import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';
import Image from 'react-image-resizer';

export default class Advertisement extends Component {
    constructor(props) {
        super(props)
        this.state = {
        }
    }

    render() {
        return (
                <Card style={{ width: '18rem' }}>
                    <Card.Img variant="top" src={this.props.ad.image} alt={this.props.ad.title} />
                    <Card.Body>
                        <hr></hr>
                        <Card.Title className="text-category-title">{this.props.ad.title}</Card.Title>
                        <Card.Text>
                            {this.props.ad.mainCategory}
                        </Card.Text>
                        <Card.Text className="bold">
                            {this.props.ad.price + " €"}  {(this.props.ad.trade ? <span className="text-trade">Trade</span> : "") }
                        </Card.Text>
                        <hr></hr>
                        <Link to={{pathname:'/adDetails/' + this.props.ad.id, state: {ad: this.props.ad}}}><Button variant="primary">Go Details</Button></Link>
                    </Card.Body>
                </Card>
        )
    }
}