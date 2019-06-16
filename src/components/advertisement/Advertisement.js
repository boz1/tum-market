import React, { Component } from 'react'
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';
import ListGroup from 'react-bootstrap/ListGroup';
import ListGroupItem from 'react-bootstrap/ListGroupItem';
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
                        <Card.Title className="text-category-title">{this.props.ad.title}</Card.Title>
                        <Card.Text>
                            {this.props.ad.price + " €"}  {(this.props.ad.trade ? <span className="text-trade">Trade</span> : "") }
                        </Card.Text>
                        {/* <ListGroup className="list-group-flush">
                            <ListGroupItem>{this.props.ad.price + " €"}</ListGroupItem>
                            {this.props.ad.trade ? <ListGroupItem className="text-trade">Trade</ListGroupItem> : ""}
                            <ListGroupItem>{this.props.ad.condition}</ListGroupItem>
                        </ListGroup> */}
                        <Button variant="primary">Go Details</Button>
                    </Card.Body>
                </Card>
        )
    }
}