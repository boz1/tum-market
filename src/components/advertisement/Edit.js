import React, { Component } from 'react'
import PropertyDropdown from './PropertyDropdown'
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import Form from 'react-bootstrap/Form';

export default class Edit extends Component {
    constructor(props) {
        super(props)
        this.state = {
            mainCategory: '',
            subCategory: '',
            condition: '',
        }
    }

    handleDropChange = (item, target) => {
        if (target === 'mainCategory') {
            this.setState({
                [target]: item,
                subCategory: 1
            });
        } else {
            this.setState({
                [target]: item
            });
        }
    }

    render() {
        let mainCatContainer, subCatContainer, conditionsContainer;

        if (this.props.categories.length > 0) {
            mainCatContainer = <PropertyDropdown handleChange={this.handleDropChange} target="mainCategory" items={this.props.categories} title="Main Category" />
        }

        if (this.props.subCategories.length > 0) {
            let id = this.state.mainCategory;
            if (id !== '') {
                subCatContainer = <PropertyDropdown handleChange={this.handleDropChange} target="subCategory" items={this.props.subCategories[id]} title="Sub Category" />
            }
            else {
                subCatContainer = <PropertyDropdown handleChange={this.handleDropChange} target="subCategory" items={[]} title="Sub Category" />
            }
        }

        if (this.props.conditions.length > 0) {
            conditionsContainer = <PropertyDropdown handleChange={this.handleDropChange} target="condition" items={this.props.conditions} title="Condition" />
        }

        return (
            <Modal show={this.props.show} onHide={this.props.close}>
                <Modal.Header>
                    <Modal.Title className="text-title ">
                        Edit advertisement
            </Modal.Title>
                </Modal.Header>
                <Modal.Body style={{ fontSize: '18px' }}>
                    <Form onSubmit={e => this.saveChanges(e)}>
                        <div className='col-md-12 d-flex'>
                            <div className="col-md-9 pl-0">
                                <div className="d-flex col-sm-12 p-0">
                                    <div className="col-sm-6 pl-0">
                                        {mainCatContainer}
                                        {subCatContainer}
                                        {conditionsContainer}
                                        <Form.Group>
                                            <Form.Label className="text-sub-title pl-0 mr-2" style={{ fontSize: "16px" }}>
                                                Image
                                                 </Form.Label>
                                            {/* <input required type="file" onChange={this.handleImageChange} /> */}
                                        </Form.Group>
                                    </div>
                                    <div className="col-sm-6 ml-2">
                                        <Form.Group>
                                            <Form.Label className="text-sub-title pl-0" style={{ fontSize: "16px" }}>
                                                Title
                                                 </Form.Label>
                                            <Form.Control name="title" maxLength="40" required type="text" placeholder="Title" onChange={this.handleChange} pattern="[a-zA-Z0-9\s.-_]{5,40}" title="Title can't be less than 5 and more than 40 characters, and can only contain alphanumeric characters." />
                                        </Form.Group>
                                        <Form.Group>
                                            <Form.Label className="text-sub-title pl-0" style={{ fontSize: "16px" }}>
                                                Trade
                                                 </Form.Label>
                                            <div className="mt-2">
                                                <label>
                                                    <input
                                                        type="radio"
                                                        value="On"
                                                        checked={this.state.trade === "On"}
                                                        onChange={this.handleChange}
                                                        name="trade"
                                                    />
                                                    <span style={{ marginLeft: "5px" }}>On</span>
                                                </label>
                                                <label className="ml-2">
                                                    <input
                                                        type="radio"
                                                        value="Off"
                                                        checked={this.state.trade === "Off"}
                                                        onChange={this.handleChange}
                                                        name="trade"
                                                    />
                                                    <span style={{ marginLeft: "5px" }}>Off</span>
                                                </label>
                                            </div>

                                        </Form.Group>
                                        <Form.Group>
                                            <Form.Label className="text-sub-title pl-0" style={{ fontSize: "16px" }}>
                                                Price (€)
                                                 </Form.Label>
                                            <Form.Control name="price" required type="number" placeholder="€" min={0} />
                                        </Form.Group>

                                    </div>
                                </div>
                                <div className="mb-1">
                                    <Form.Group className="pl-0">
                                        <Form.Label className="text-sub-title" style={{ fontSize: "16px" }}>Description <span style={{ color: "#707070", fontSize: "14px" }}>(max 250 characters)</span></Form.Label>
                                        <Form.Control name="description" required as="textarea" rows="3" maxLength="250" placeholder="Descibe your product..." />
                                    </Form.Group>
                                </div>
                            </div>
                            <div>
                                <Button variant="primary" type="submit">
                                    Complete
                                </Button>
                            </div>
                        </div>
                    </Form>
                </Modal.Body>
            </Modal >
        )
    }
}
