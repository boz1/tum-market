import React, { Component } from 'react'
import firebase, { storage } from '../../config/firebaseConfig';
import PropertyDropdown from './PropertyDropdown'
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import history from '../../history'
import { css } from '@emotion/core';
import { RingLoader } from 'react-spinners';


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
            condition: '',
            title: '',
            price: '',
            description: '',
            image: '',
            trade: "On",
            loading: false
        }

        this.handleDropChange = this.handleDropChange.bind(this)
        this.handleChange = this.handleChange.bind(this)
        this.handleImageChange = this.handleImageChange.bind(this)
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
        this.setState({ [e.target.name]: e.target.value });
    }

    handleImageChange(event) {
        if (event.target.files[0]) {
            const image = event.target.files[0];
            this.setState(() => ({ image }));
        }
    }

    getValue = (item) => {
        const ad = this.props.ad;
        console.log(ad)

        if (this.state[item] === "") {
            item = ad[item];
        }
        else {
            item = this.state[item]
        }
        return item;
    }

    handleSubmit(event) {
        event.preventDefault();
        this.setState({
            loading: true,
        })

        let price, title, desc;

        const ad = this.props.ad;
        const userId = this.props.user.info.id;

        price = this.getValue("price");
        desc = this.getValue("description");
        title = this.getValue("title");

        // Get date
        var today = new Date(),
            date = today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate() + " " + today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();

        let trade;

        if (this.state.trade === "On") {
            trade = true
        } else {
            trade = false
        }


        if (this.state.image !== "") {
            const { image } = this.state;
            // Upload Image
            let imageUrl;
            const uploadImage = storage.ref(`images/${userId}/${ad.id}/${image.name}`).put(image);

            uploadImage.on('state_changed',
                (snapshot) => {
                    // progrss function ....
                    const progress = Math.round((snapshot.bytesTransferred / snapshot.totalBytes) * 100);
                    console.log("progress " + progress)
                },
                (error) => {
                    // error function ....
                    console.log("error " + error);
                },
                () => {
                    // complete function ....
                    storage.ref(`images/${userId}/${ad.id}/${image.name}`).getDownloadURL().then(url => {
                        imageUrl = url;
                        // // Insert to databse
                        const update = {
                            title: title,
                            userId: ad.userId,
                            id: ad.id,
                            price: price,
                            trade: trade,
                            image: imageUrl,
                            description: desc,
                            mainCategoryId: this.state.mainCategory,
                            subCategoryId: this.state.subCategory,
                            conditionId: this.state.condition,
                            modifyDate: date,
                            dateAdded: ad.dateAdded
                        };

                        var updates = {};
                        updates['/advertisements/' + userId + '/' + ad.id] = update;

                        firebase.database().ref().update(updates);

                        history.push('/')
                    })
                });
        }
        else {
            const update = {
                title: title,
                userId: ad.userId,
                id: ad.id,
                price: price,
                trade: trade,
                image: ad.image,
                description: desc,
                mainCategoryId: this.state.mainCategory,
                subCategoryId: this.state.subCategory,
                conditionId: this.state.condition,
                modifyDate: date,
                dateAdded: ad.dateAdded
            };

            var updates = {};
            updates['/advertisements/' + userId + '/' + ad.id] = update;

            firebase.database().ref().update(updates);

            history.push('/')
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
            <Modal show={this.props.show} onHide={this.props.close} backdrop="static" keyboard={false}>
                <Modal.Header>
                    <Modal.Title className="text-title ">
                        Edit Advertisement
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
                                        {conditionsContainer}
                                        <Form.Group>
                                            <Form.Label className="text-sub-title pl-0 mr-2" style={{ fontSize: "16px" }}>
                                                Image
                                                 </Form.Label>
                                            <input type="file" style={{ fontSize: "14px" }} onChange={this.handleImageChange} />
                                        </Form.Group>
                                    </div>
                                    <div className="col-sm-6 ml-2">
                                        <Form.Group>
                                            <Form.Label className="text-sub-title pl-0" style={{ fontSize: "16px" }}>
                                                Title
                                                 </Form.Label>
                                            <Form.Control name="title" maxLength="40" type="text" placeholder="Title" onChange={this.handleChange} pattern="[a-zA-Z0-9äöüÄÖÜß\s\)\(-_.]{5,40}" title="Title can't be less than 5 and more than 40 characters, and can only contain English, German and following characters .-_()*=+." />
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
                                                Price (€)
                                                 </Form.Label>
                                            <Form.Control name="price" type="number" onChange={this.handleChange} placeholder="€" min={0} step="0.01" />
                                        </Form.Group>

                                    </div>
                                </div>
                                <div className="mb-1">
                                    <Form.Group className="pl-0">
                                        <Form.Label className="text-sub-title" style={{ fontSize: "16px" }}>Description <span style={{ color: "#707070", fontSize: "14px" }}>(max 250 characters)</span></Form.Label>
                                        <Form.Control name="description" as="textarea" rows="3" maxLength="250" onChange={this.handleChange} placeholder="Descibe your product..." />
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
