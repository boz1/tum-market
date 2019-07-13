import React, { Component } from 'react'
import Title from '../Title'
import PropertyDropdown from '../PropertyDropdown'
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import Modal from 'react-bootstrap/Modal';
import ConfirmationModal from '../ConfirmationModal'
import history from '../../history'
import { css } from '@emotion/core';
import { RingLoader } from 'react-spinners';
import AdService from '../../services/AdService'

const override = css`
    display: block;
    margin: 0 auto;
    border-color: red;
`;

export default class NewAdvertisement extends Component {
    constructor(props) {
        super(props)
        this.state = {
            mainCategory: '',
            subCategory: '',
            condition: '',
            title: '',
            price: 0,
            description: '',
            image: null,
            trade: "On",
            showModal: false,
            loading: false,
            imageSrc: null
        }

        this.handleDropChange = this.handleDropChange.bind(this)
        this.handleChange = this.handleChange.bind(this)
        this.handleImageChange = this.handleImageChange.bind(this)
        this.handleSubmit = this.handleSubmit.bind(this)
        this.showRequestModal = this.showRequestModal.bind(this)
        this.handleClose = this.handleClose.bind(this)
        this.getMainCatTitle = this.getMainCatTitle.bind(this)
        this.updateAd = this.updateAd.bind(this)
    }

    handleDropChange(item, target) {
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

    handleImageChange(event) {
        if (event.target.files[0]) {
            const image = event.target.files[0];
            let reader = new FileReader();
            let imageSrc;

            reader.onload = function (e) {
                imageSrc = e.target.result;
                this.setState(() => ({ image, imageSrc }));
            }.bind(this);

            reader.readAsDataURL(event.target.files[0]);
        }
    }

    getMainCatTitle() {
        let title;
        if (Object.getOwnPropertyNames(this.props.categories).length !== 0) {
            this.props.categories.forEach(element => {
                if (element !== null) {
                    if (element.id === this.state.mainCategory) {
                        title = element.title
                    }
                }
            });
        }
        return title;
    }

    updateAd(id, ad, image) {
        AdService.updateAd(id, ad, image).then((msg) => {
            this.props.reRender()
            history.push('/myAds')
        }).catch((e) => {
            console.log(e);
        });
    }

    handleSubmit(event) {
        event.preventDefault();
        this.setState({
            loading: true,
            showModal: false
        })

        // Get date
        var today = new Date(),
            date = today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate() + " " + today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();

        let trade;

        if (this.state.trade === "On") {
            trade = true
        } else {
            trade = false
        }

        const imageTitle = this.state.image.name;

        AdService.createKey(this.props.user.info.id).then((data) => {
            return data.obj;
        })
            .then((key) => {
                const ad = {
                    title: this.state.title,
                    price: this.state.price,
                    trade: trade,
                    userId: this.props.user.info.id,
                    id: key,
                    image: "",
                    description: this.state.description,
                    mainCategoryId: this.state.mainCategory,
                    subCategoryId: this.state.subCategory,
                    conditionId: this.state.condition,
                    dateAdded: date,
                    imageTitle: imageTitle
                };
                this.updateAd(this.props.user.info.id, ad, this.state.image)
            })
            .catch((e) => {
                console.log(e);
            });
    }

    showRequestModal(e) {
        e.preventDefault();

        this.setState({
            showModal: true
        })
    }

    handleClose() {
        this.setState({ showModal: false });
    }

    goHome = () => {
        history.push('/')
    }

    render() {
        let mainCatContainer, subCatContainer, conditionsContainer;

        if (this.props.categories.length > 0) {
            mainCatContainer = <PropertyDropdown isRequired={true} handleChange={this.handleDropChange} target="mainCategory" items={this.props.categories} title="Main Category" />
        }

        if (this.props.subCategories.length > 0) {
            let id = this.state.mainCategory;
            if (id !== '') {
                subCatContainer = <PropertyDropdown isRequired={true} handleChange={this.handleDropChange} target="subCategory" items={this.props.subCategories[id]} title="Sub Category" />
            }
            else {
                subCatContainer = <PropertyDropdown isRequired={true} handleChange={this.handleDropChange} target="subCategory" items={[]} title="Sub Category" />
            }
        }

        if (this.props.conditions.length > 0) {
            conditionsContainer = <PropertyDropdown isRequired={true} handleChange={this.handleDropChange} target="condition" items={this.props.conditions} title="Condition" />
        }

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

        let isPremium = false;
        if (this.props.user.info !== undefined) {
            if (this.props.user.info.isPremium) {
                isPremium = true;
            }
        }

        let modal = <ConfirmationModal show={this.state.showModal} onHide={this.handleClose} title="New Advertisement" txt="Are you sure to create this advertisement?" onClickClose={this.handleClose} onClickConfirm={this.handleSubmit} />

        let imageSrc;

        if (this.state.imageSrc !== null) {
            imageSrc = this.state.imageSrc
        }
        else {
            imageSrc = "http://via.placeholder.com/200x150"
        }

        return (
            <React.Fragment>
                <div className="container">
                    <Title title="Create New Advertisement" />
                    <hr className="my-2"></hr>
                    <div className="row"></div>
                    <Form onSubmit={e => this.showRequestModal(e)}>
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
                                            <input required type="file" accept="image/*" onChange={this.handleImageChange} />
                                        </Form.Group>
                                    </div>
                                    <div className="col-sm-6 ml-2">
                                        <Form.Group>
                                            <Form.Label className="text-sub-title pl-0" style={{ fontSize: "16px" }}>
                                                Title
                                                 </Form.Label>
                                            <Form.Control name="title" maxLength="40" required type="text" placeholder="Title" onChange={this.handleChange} pattern="[a-zA-Z0-9äöüÄÖÜß\s\)\(-_.!]{5,40}" title="Title can't be less than 5 and more than 40 characters, and can only contain English, German and following characters .-_()*=+.!" />
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
                                            <Form.Control name="price" required type="number" placeholder="€" onChange={this.handleChange} min={0} step="0.01" />
                                        </Form.Group>
                                    </div>
                                </div>
                                <div className="mb-1">
                                    <Form.Group className="pl-0">
                                        <Form.Label className="text-sub-title" style={{ fontSize: "16px" }}>Description <span style={{ color: "#707070", fontSize: "14px" }}>(max 1000 characters)</span></Form.Label>
                                        <Form.Control name="description" required as="textarea" rows="3" onChange={this.handleChange} maxLength="1000" placeholder="Descibe your product..." />
                                    </Form.Group>
                                </div>
                            </div>
                            <div className="col-md-3 d-block">
                                <div className="mb-2">
                                    <Form.Group className="pl-0">
                                        <Form.Label className="text-sub-title" style={{ fontSize: "16px" }}>Preview</Form.Label>
                                        <Card style={{ width: 'auto', height: 'fit-content' }} className={isPremium ? "premium" : ""}>
                                            <div className="m-auto">
                                                <img
                                                    src={imageSrc}
                                                    style={{
                                                        height: "150px", width: "200px", marginTop: "12px"
                                                    }}
                                                    alt="Product"
                                                />
                                            </div>
                                            <Card.Body className="p-2">
                                                <hr></hr>
                                                <Card.Title className="text-ad-title">{this.state.title}</Card.Title>
                                                <Card.Text>
                                                    {this.getMainCatTitle()}
                                                </Card.Text>
                                                <Card.Text className="bold">
                                                    <span className="text-premium">{this.state.price + " €"}</span>  {(this.state.trade === "On" ? <span className="text-trade">Trade</span> : "")}
                                                </Card.Text>
                                            </Card.Body>
                                        </Card>
                                    </Form.Group>
                                </div>
                                <div>
                                    <Button variant="danger" onClick={this.goHome}>
                                        Cancel
                                        </Button>
                                    <Button variant="primary" type="submit" className="float-right">
                                        Complete
                                        </Button>
                                </div>
                            </div>
                        </div>
                    </Form>
                    {modal}
                    {loading}
                </div>
            </React.Fragment>
        )
    }
}
