import React, { Component } from 'react'
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';

export default class ConfirmationModal extends Component {
    constructor(props) {
        super(props)

        this.state = {
        }
    }

    render() {
        return (
            <Modal show={this.props.show} onHide={this.props.onHide}>
                <Modal.Header>
                    <Modal.Title className="text-title ">
                        {this.props.title}
                </Modal.Title>
                </Modal.Header>
                <Modal.Body style={{ fontSize: '18px' }}>
                    {this.props.txt}
                  </Modal.Body>
                <Modal.Footer>
                    <Button variant="danger" onClick={this.props.onClickClose}>
                        Close
                </Button>
                    <Button variant="success" onClick={this.props.onClickConfirm}>
                        Confirm
                </Button>
                </Modal.Footer>
            </Modal>
        )
    }
}
