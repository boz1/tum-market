import React, { Component } from 'react'
import firebase, { storage } from '../../config/firebaseConfig';
import Title from '../Title'
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import Modal from 'react-bootstrap/Modal';
import history from '../../history'
import { css } from '@emotion/core';
import { RingLoader } from 'react-spinners';

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
            loading: false
        }

        this.handleMainCatChange = this.handleMainCatChange.bind(this)
        this.handleSubCatChange = this.handleSubCatChange.bind(this)
        this.handleConditionChange = this.handleConditionChange.bind(this)
        this.handleChange = this.handleChange.bind(this)
        this.handleImageChange = this.handleImageChange.bind(this)
        this.handleSubmit = this.handleSubmit.bind(this)
        this.showRequestModal = this.showRequestModal.bind(this)
        this.handleClose = this.handleClose.bind(this)
        this.getMainCatTitle = this.getMainCatTitle.bind(this)
    }


    handleMainCatChange(event) {
        const mainCat = parseInt(this.refs.mainCat.value)
        this.setState({
            mainCategory: mainCat
        });
    }

    handleSubCatChange(event) {
        const subCat = parseInt(this.refs.subCat.value)
        this.setState({
            subCategory: subCat
        });
    }

    handleConditionChange(event) {
        const condition = parseInt(this.refs.cond.value)
        this.setState({
            condition: condition
        });
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

    getMainCatTitle() {
        let title;
        if (Object.getOwnPropertyNames(this.props.categories).length !== 0) {
            this.props.categories.forEach(element => {
                if (element.id === this.state.mainCategory) {
                    title = element.title
                }
            });
        }
        return title;
    }

    handleSubmit(event) {
        event.preventDefault();
        this.setState({
            loading: true,
            showModal: false
        })

        var newPostKey = firebase.database().ref('advertisements').child(this.props.user.info.id).push().key;

        // Get date
        var today = new Date(),
            date = today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate() + " " + today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();

        let trade;

        if (this.state.trade === "On") {
            trade = true
        } else {
            trade = false
        }

        // Upload Image
        const { image } = this.state;
        let imageUrl;
        const uploadImage = storage.ref(`images/${this.props.user.info.id}/${newPostKey}/${image.name}`).put(image);

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
                storage.ref(`images/${this.props.user.info.id}/${newPostKey}/${image.name}`).getDownloadURL().then(url => {
                    imageUrl = url;
                    // // Insert to databse
                    const ad = {
                        title: this.state.title,
                        price: this.state.price,
                        trade: trade,
                        userId: this.props.user.info.id,
                        id: newPostKey,
                        image: imageUrl,
                        description: this.state.description,
                        mainCategoryId: this.state.mainCategory,
                        subCategoryId: this.state.subCategory,
                        conditionId: this.state.condition,
                        date: date
                    };

                    var updates = {};
                    updates['/advertisements/' + this.props.user.info.id + '/' + newPostKey] = ad;

                    firebase.database().ref().update(updates);

                    history.push('/')
                })
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


    render() {
        let mainCategories = [];
        let subCategories = [];
        let conditions = [];

        let mainCatContainer, subCatContainer, conditionsContainer;

        if (this.props.categories.length > 0) {
            mainCategories.push(<option key="empty" disabled value={''}>Choose...</option>)
            this.props.categories.map((cat) => mainCategories.push(<option key={cat.id + cat.title} value={cat.id}>{cat.title}</option>))
            mainCatContainer = <Form.Control required as="select" defaultValue={''} onChange={this.handleMainCatChange} ref="mainCat">
                {mainCategories}
            </Form.Control>
        }

        if (this.props.subCategories.length > 0) {
            let id = this.state.mainCategory;
            subCategories.push(<option key="empty" disabled value={''}>Choose...</option>)
            if (this.state.mainCategory !== '') {
                this.props.subCategories[id].map((cat) => subCategories.push(<option key={cat.id + cat.title} value={cat.id}>{cat.title}</option>))
            }
            subCatContainer = <Form.Control required as="select" defaultValue={''} onChange={this.handleSubCatChange} ref="subCat">
                {subCategories}
            </Form.Control>
        }

        if (this.props.conditions.length > 0) {
            conditions.push(<option key="empty" disabled value={''}>Choose...</option>)
            this.props.conditions.map((con) => conditions.push(<option key={con.id + con.title} value={con.id}>{con.title}</option>))
            conditionsContainer = <Form.Control required as="select" defaultValue={''} onChange={this.handleConditionChange} ref="cond">
                {conditions}
            </Form.Control>
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

        let isPremium =false;
        if (this.props.user.info !== undefined) {
            if(this.props.user.info.isPremium){
                isPremium = true;
            }
        }

        let modal = <Modal show={this.state.showModal} onHide={this.handleClose}>
            <Modal.Header>
                <Modal.Title className="text-title ">
                    New Advertisement Confirmation
            </Modal.Title>
            </Modal.Header>
            <Modal.Body style={{ fontSize: '18px' }}>
                Are you sure to create this advertisement?
              </Modal.Body>
            <Modal.Footer>
                <Button variant="danger" onClick={this.handleClose}>
                    Close
            </Button>
                <Button variant="success" onClick={this.handleSubmit}>
                    Confirm
            </Button>
            </Modal.Footer>
        </Modal>

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
                                        <Form.Group>
                                            <Form.Label className="text-sub-title" style={{ fontSize: "16px" }} >Main Category</Form.Label>
                                            {mainCatContainer}
                                        </Form.Group>
                                        <Form.Group >
                                            <Form.Label className="text-sub-title" style={{ fontSize: "16px" }}>Sub Category</Form.Label>
                                            {subCatContainer}
                                        </Form.Group>
                                        <Form.Group>
                                            <Form.Label className="text-sub-title" style={{ fontSize: "16px" }}>Condition</Form.Label>
                                            {conditionsContainer}
                                        </Form.Group>
                                        <Form.Group>
                                            <Form.Label className="text-sub-title pl-0 mr-2" style={{ fontSize: "16px" }}>
                                                Image
                                                 </Form.Label>
                                            <input required type="file" onChange={this.handleImageChange} />
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
                                            <Form.Control name="price" required type="number" placeholder="€" onChange={this.handleChange} min={0} />
                                        </Form.Group>

                                    </div>
                                </div>
                                <div className="mb-1">
                                    <Form.Group className="pl-0">
                                        <Form.Label className="text-sub-title" style={{ fontSize: "16px" }}>Description <span style={{ color: "#707070", fontSize: "14px" }}>(max 250 characters)</span></Form.Label>
                                        <Form.Control name="description" required as="textarea" rows="3" onChange={this.handleChange} maxLength="250" placeholder="Descibe your product..." />
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
                                                    src={'http://via.placeholder.com/200x150'}
                                                    style={{
                                                        height: "auto", width: "auto", marginTop: "12px"
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
                                    <Button variant="primary" type="submit">
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
