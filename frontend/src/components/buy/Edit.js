import React, { Component } from 'react'
import PropertyDropdown from '../PropertyDropdown'
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import history from '../../history'
import { css } from '@emotion/core';
import { RingLoader } from 'react-spinners';
import BuyingRequestService from '../../services/BuyingRequestService'


const override = css`
    display: block;
    margin: 0 auto;
    border-color: red;
`;

export default class Edit extends Component {
    constructor(props) {
        super(props)
        this.state = {
            mainCategory: '',
            subCategory: '',
            title: '',
            price: '',
            description: '',
            loading: false
        }

        this.handleDropChange = this.handleDropChange.bind(this)
        this.handleChange = this.handleChange.bind(this)
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
            if(e.target.value < 0) {
                e.target.value = ''
            }
        }
        this.setState({ [e.target.name]: e.target.value });
    }

    getValue = (item) => {
        const buy = this.props.buyingRequest;

        if (this.state[item] === "") {
            if(item === "condition" || item === "mainCategory" || item === "subCategory"){
                item = buy[item].id;
            }else{
                item = buy[item];
            }
        }
        else {
            item = this.state[item]
        }
        return item;
    }

    updateBuyingRequest(id, buy) {
        BuyingRequestService.updateBuyingRequest(id, buy).then((msg) => {
            this.props.reRender()
            history.push('/myBuy')
        }).catch((e) => {
            console.log(e);
        });
    }

    handleSubmit(event) {
        event.preventDefault();
        this.setState({
            loading: true,
        })

        let price, title, desc, mainCategory, subCategory;

        const buyingRequest = this.props.buyingRequest;
        const userId = this.props.user.info.id;

        price = this.getValue("price");
        desc = this.getValue("description");
        title = this.getValue("title");
        mainCategory = this.getValue("mainCategory");
        subCategory = this.getValue("subCategory");

        // Get date
        var today = new Date(),
            date = today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate() + " " + today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();

        const update = {
            title: title,
            userId: buyingRequest.userId,
            id: buyingRequest.id,
            price: price,
            description: desc,
            mainCategoryId: mainCategory,
            subCategoryId: subCategory,
            modifyDate: date,
            dateAdded: buyingRequest.dateAdded
        };

        this.updateBuyingRequest(userId, update)
    }

    render() {
        let mainCatContainer, subCatContainer;

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

        return (
            <Modal show={this.props.show} onHide={this.props.close} backdrop="static" keyboard={false}>
                <Modal.Header>
                    <Modal.Title className="text-title ">
                        Edit Buying Request
            </Modal.Title>
                </Modal.Header>
                <Modal.Body style={{ fontSize: '18px' }}>
                    <Form onSubmit={e => this.handleSubmit(e)}>
                        <div className='col-md-12 d-flex'>
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
                                                Price (€)
                                                 </Form.Label>
                                            <Form.Control name="price" type="number" onChange={this.handleChange} placeholder="€" min={0} step="0.01" />
                                        </Form.Group>

                                    </div>
                                </div>
                                <div className="mb-1">
                                    <Form.Group className="pl-0">
                                        <Form.Label className="text-sub-title" style={{ fontSize: "16px" }}>Description <span style={{ color: "#707070", fontSize: "14px" }}>(max 1000 characters)</span></Form.Label>
                                        <Form.Control name="description" as="textarea" rows="3" maxLength="1000" onChange={this.handleChange} placeholder="Descibe your product..." />
                                    </Form.Group>
                                    <div>
                                        <Button variant="danger" onClick={this.props.close}>
                                            Close
                                </Button>
                                        <Button variant="primary" type="submit" className="float-right">
                                            Save
                                </Button>
                                    </div>
                                </div>
                            </div>
                        </div>

                    </Form>
                    {loading}
                </Modal.Body>
            </Modal >
        )
    }
}
