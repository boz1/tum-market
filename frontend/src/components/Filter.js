import React, { Component } from 'react';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import PropertyDropdown from './PropertyDropdown'
import { css } from '@emotion/core';
import { RingLoader } from 'react-spinners';
import Modal from 'react-bootstrap/Modal';

const override = css`
    display: block;
    margin: 0 auto;
    border-color: red;
`;

export default class Filter extends Component {
    constructor(props) {
        super(props)
        this.state = {
            mainCategory: '',
            subCategory: '',
            condition: '',
            title: '',
            minPrice: 0,
            maxPrice: 10,
            trade: "On",
            showFilter: false,
            market: "Seller's Market"
        }

        this.handleChange = this.handleChange.bind(this)
        this.handleDropChange = this.handleDropChange.bind(this)
        this.handleSubmit = this.handleSubmit.bind(this)
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

    handleChange(e) {
        if (e.target.name === 'price') {
            if (e.target.value < 0) {
                e.target.value = ''
            }
        }
        this.setState({ [e.target.name]: e.target.value });
    }

    getValue = (item) => {
        const ad = this.props.ad;

        if (this.state[item] === "") {
            if (item === "condition") {
                item = ad[item].id;
            } else {
                item = ad[item];
            }
        }
        else {
            item = this.state[item]
        }
        return item;
    }

    //not sure if this is also needed to do
    /*handleCancel() {
        document.getElementById("create-filteredsearch-form").reset();

        this.setState({
            mainCategory: '',
            subCategory: '',
            condition: '',
            title: '',
            minPrice: 0,
            maxPrice: 0,
            trade: "On",
        });

    }*/

    handleSubmit(event) {
        event.preventDefault()
        this.props.filteredSearch(this.state)
    };

    changeMarket = () => {
        if (this.state.market === "Seller's Market") {
            this.setState({ market: "Buyer's Market" })
        }
        else {
            this.setState({ market: "Seller's Market" })
        }
    }

    render() {
        let mainCatContainer, subCatContainer, conditionsContainer;

        let loading = <Modal show={this.state.loading}>
            <Modal.Body>
                <RingLoader
                    css={override}
                    sizeUnit={"px"}
                    size={100}
                    color={'#006BD6'}
                    loading={this.state.loading}
                />
            </Modal.Body>
        </Modal>

        if (this.props.categories.length > 0) {
            mainCatContainer = <PropertyDropdown isRequired={false} handleChange={this.handleDropChange} target="mainCategory" items={this.props.categories} title="Main Category" />
        }

        if (this.props.subCategories.length > 0) {
            let id = this.state.mainCategory;
            if (id !== '') {
                subCatContainer = <PropertyDropdown isRequired={false} handleChange={this.handleDropChange} target="subCategory" items={this.props.subCategories[id]} title="Sub Category" />
            }
            else {
                subCatContainer = <PropertyDropdown isRequired={false} handleChange={this.handleDropChange} target="subCategory" items={[]} title="Sub Category" />
            }
        }

        if (this.props.conditions.length > 0) {
            conditionsContainer = <PropertyDropdown isRequired={false} handleChange={this.handleDropChange} target="condition" items={this.props.conditions} title="Condition" />
        }

        let body;
        let selectedMarketText = "";
        let switchMarketText = "";


        if (this.state.market === "Seller's Market") {
            selectedMarketText = "Seller's Market"
            switchMarketText = "Buyer's Market"

            body = <div className='col-md-12 d-flex'>
                <div className="col-md-12 pl-0">
                    <div className="d-flex col-sm-12 p-0">
                        <div className="col-sm-6 pl-0">
                            {mainCatContainer}
                            {subCatContainer}
                            {conditionsContainer}
                        </div>
                        <div className="col-sm-6 ml-2">
                            <Form.Group>
                                <Form.Label className="text-sub-title pl-0" style={{ fontSize: "16px" }}>
                                    Title
                                 </Form.Label>
                                <Form.Control name="title" maxLength="40" type="text" placeholder="Title" onChange={this.handleChange} pattern="[a-zA-Z0-9äöüÄÖÜß\s\)\(-_.!]{5,40}" title="Title can't be less than 5 and more than 40 characters, and can only contain English, German and following characters .-_()*=+.!" />
                            </Form.Group>
                            <Form.Group>
                                <Form.Label className="text-sub-title pl-0" style={{ fontSize: "16px" }}>
                                    Trade
                                 </Form.Label>
                                <div className="mt-1">
                                    <label>
                                        <input
                                            type="radio"
                                            value="On"
                                            checked={this.state.trade === "On"}
                                            onChange={this.handleChange}
                                            name="trade"
                                        />
                                        <span style={{ marginLeft: "5px", fontSize: "14px" }}>On</span>
                                    </label>
                                    <label className="ml-2">
                                        <input
                                            type="radio"
                                            value="Off"
                                            checked={this.state.trade === "Off"}
                                            onChange={this.handleChange}
                                            name="trade"
                                        />
                                        <span style={{ marginLeft: "5px", fontSize: "14px" }}>Off</span>
                                    </label>
                                </div>
                            </Form.Group>
                            <Form.Group>
                                <Form.Label className="text-sub-title pl-0" style={{ fontSize: "16px" }}>
                                    Min Price (€)
                                 </Form.Label>
                                <Form.Control name="minPrice" type="number" onChange={this.handleChange} placeholder="€" min={0} max={this.state.maxPrice} step="0.01" />
                                <Form.Label className="text-sub-title pl-0" style={{ fontSize: "16px" }}>
                                    Max Price (€)
                                 </Form.Label>
                                <Form.Control name="maxPrice" type="number" onChange={this.handleChange} placeholder="€" min={this.state.minPrice} step="0.01" />
                            </Form.Group>

                        </div>
                    </div>
                    <div className="mb-1">
                        <div>
                            <Button variant="danger" onClick={this.props.close}>
                                Close
                </Button>
                            <Button variant="primary" type="submit" className="float-right">
                                Search
                </Button>
                        </div>
                    </div>
                </div>
            </div>
        }
        else {
            selectedMarketText = "Buyer's Market"
            switchMarketText = "Seller's Market"

            body = <div className='col-md-12 d-flex'>
                <div className="col-md-12 pl-0">
                    <div className="d-flex col-sm-12 p-0">
                        <div className="col-sm-6 pl-0">
                            {mainCatContainer}
                            {subCatContainer}
                        </div>
                        <div className="col-sm-6 ml-2">
                            <Form.Group>
                                <Form.Label className="text-sub-title pl-0" style={{ fontSize: "16px" }}>
                                    Title
                                                 </Form.Label>
                                <Form.Control name="title" maxLength="40" type="text" placeholder="Title" onChange={this.handleChange} pattern="[a-zA-Z0-9äöüÄÖÜß\s\)\(-_.!]{5,40}" title="Title can't be less than 5 and more than 40 characters, and can only contain English, German and following characters .-_()*=+.!" />
                            </Form.Group>
                            <Form.Group>
                                <Form.Label className="text-sub-title pl-0" style={{ fontSize: "16px" }}>
                                    Min Price (€)
                                                 </Form.Label>
                                <Form.Control name="minPrice" type="number" onChange={this.handleChange} placeholder="€" min={0} max={this.state.maxPrice} step="0.01" />
                                <Form.Label className="text-sub-title pl-0" style={{ fontSize: "16px" }}>
                                    Max Price (€)
                                                 </Form.Label>
                                <Form.Control name="maxPrice" type="number" onChange={this.handleChange} placeholder="€" min={this.state.minPrice} step="0.01" />
                            </Form.Group>

                        </div>
                    </div>
                    <div className="mb-1">
                        <div>
                            <Button variant="danger" onClick={this.props.close}>
                                Close
                                </Button>
                            <Button variant="primary" type="submit" className="float-right">
                                Search
                                </Button>
                        </div>
                    </div>
                </div>
            </div>
        }

        let marketSwitch = <div className="row ml-2 title-text" style={{ marginTop: "5px" }}>{selectedMarketText}|<span style={{ color: "#707070", fontSize: "20px", marginLeft: "5px", cursor: "pointer" }} onClick={this.changeMarket}>{switchMarketText}</span></div>

        return (
            <Modal show={this.props.show} onHide={this.props.close} backdrop="static" keyboard={false}>
                <Modal.Header>
                    <Modal.Title className="text-title ">
                        Filtered Search
            </Modal.Title>
                    {marketSwitch}
                </Modal.Header>

                <Modal.Body style={{ fontSize: '18px' }}>
                    <Form onSubmit={e => this.handleSubmit(e)}>
                        {body}
                    </Form>
                    {loading}
                </Modal.Body>
            </Modal >
        )
    }
}

