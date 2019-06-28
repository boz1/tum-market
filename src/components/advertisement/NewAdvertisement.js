import React, { Component } from 'react'
import { storage } from '../../config/firebaseConfig';
import Title from '../Title'
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import Image from 'react-image-resizer';
import Modal from 'react-bootstrap/Modal';

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
            showModal: false
        }

        this.handleMainCatChange = this.handleMainCatChange.bind(this)
        this.getMainCatId = this.getMainCatId.bind(this)
        this.handleSubCatChange = this.handleSubCatChange.bind(this)
        this.handleTitleChange = this.handleTitleChange.bind(this)
        this.handleConditionChange = this.handleConditionChange.bind(this)
        this.handlePriceChange = this.handlePriceChange.bind(this)
        this.handleTradeChange = this.handleTradeChange.bind(this)
        this.handleDescriptionChange = this.handleDescriptionChange.bind(this)
        this.handleImageChange = this.handleImageChange.bind(this)
        this.handleSubmit = this.handleSubmit.bind(this)
        this.showRequestModal = this.showRequestModal.bind(this)
        this.handleClose = this.handleClose.bind(this)
    }


    handleMainCatChange(event) {
        const mainCat = event.target.value
        this.setState({
            mainCategory: mainCat
        });
    }

    handleSubCatChange(event) {
        const subCat = event.target.value
        this.setState({
            subCategory: subCat
        });
    }

    handleConditionChange(event) {
        const condition = event.target.value
        this.setState({
            condition: condition
        });
    }

    handleTitleChange(event) {
        const title = event.target.value
        this.setState({
            title: title
        });
    }

    handlePriceChange(event) {
        const price = event.target.value
        this.setState({
            price: price
        });
    }

    handleTradeChange(event) {
        const trade = event.target.value
        this.setState({
            trade: trade
        });
    }

    handleDescriptionChange(event) {
        const description = event.target.value
        this.setState({
            description: description
        });
    }

    handleImageChange(event) {
        if (event.target.files[0]) {
            const image = event.target.files[0];
            this.setState(() => ({ image }));
        }
    }

    getMainCatId() {
        let id;
        this.props.categories.forEach(element => {
            if (element.title === this.state.mainCategory) {
                id = element.id
            }
        });
        return id;
    }

    handleSubmit(event) {
        event.preventDefault();

        // console.log(this.state)
        // const { image } = this.state;
        // const uploadTask = storage.ref(`images/${this.props.user.info.id}/${image.name}`).put(image);
    
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
        console.log(this.props.user)
        let mainCategories = [];
        let subCategories = [];
        let conditions = [];

        let mainCatContainer, subCatContainer, conditionsContainer;

        if (this.props.categories.length > 0) {
            mainCategories.push(<option key="empty" disabled value={''}>Choose...</option>)
            this.props.categories.map((cat) => mainCategories.push(<option key={cat.id + cat.title}>{cat.title}</option>))
            mainCatContainer = <Form.Control required as="select" defaultValue={''} onChange={this.handleMainCatChange}>
                {mainCategories}
            </Form.Control>
        }

        if (this.props.subCategories.length > 0) {
            let id = this.getMainCatId();
            subCategories.push(<option key="empty" disabled value={''}>Choose...</option>)
            if (this.state.mainCategory !== '') {
                this.props.subCategories[id].map((cat) => subCategories.push(<option key={cat.id + cat.title}>{cat.title}</option>))
            }
            subCatContainer = <Form.Control required as="select" defaultValue={''} onChange={this.handleSubCatChange}>
                {subCategories}
            </Form.Control>
        }

        if (this.props.conditions.length > 0) {
            conditions.push(<option key="empty" disabled value={''}>Choose...</option>)
            this.props.conditions.map((con) => conditions.push(<option key={con.id + con.title}>{con.title}</option>))
            conditionsContainer = <Form.Control required as="select" defaultValue={''} onChange={this.handleConditionChange}>
                {conditions}
            </Form.Control>
        }

        let modal = <Modal show={this.state.showModal} onHide={this.handleClose}>
            <Modal.Header>
                <Modal.Title className="text-title ">
                    New Advertisement Confirmation
            </Modal.Title>
            </Modal.Header>
            <Modal.Body style={{ fontSize: '16px' }}>
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
                                            <Form.Control maxLength="40" required type="text" placeholder="Title" onChange={this.handleTitleChange} pattern="[a-zA-Z0-9]{5,40}" title="Title can't be less than 5 and more than 40 characters, and can only contain alphanumeric characters." />
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
                                                        onChange={this.handleTradeChange}
                                                    />
                                                    <span style={{ marginLeft: "5px" }}>On</span>
                                                </label>
                                                <label className="ml-2">
                                                    <input
                                                        type="radio"
                                                        value="Off"
                                                        checked={this.state.trade === "Off"}
                                                        onChange={this.handleTradeChange}
                                                    />
                                                    <span style={{ marginLeft: "5px" }}>Off</span>
                                                </label>
                                            </div>

                                        </Form.Group>
                                        <Form.Group>
                                            <Form.Label className="text-sub-title pl-0" style={{ fontSize: "16px" }}>
                                                Price (€)
                                                 </Form.Label>
                                            <Form.Control required type="number" placeholder="€" onChange={this.handlePriceChange} min={0} />
                                        </Form.Group>

                                    </div>
                                </div>
                                <div className="mb-1">
                                    <Form.Group className="pl-0">
                                        <Form.Label className="text-sub-title" style={{ fontSize: "16px" }}>Description <span style={{ color: "#707070", fontSize: "14px" }}>(max 250 characters)</span></Form.Label>
                                        <Form.Control required as="textarea" rows="3" onChange={this.handleDescriptionChange} maxLength="250" placeholder="Descibe your product..." />
                                    </Form.Group>
                                </div>
                            </div>
                            <div className="col-md-3 d-block">
                                <div className="mb-2">
                                    <Form.Group className="pl-0">
                                        <Form.Label className="text-sub-title" style={{ fontSize: "16px" }}>Preview</Form.Label>
                                        <Card style={{ width: 'auto', height: 'fit-content' }}>
                                            <Image
                                                src={'http://via.placeholder.com/400x300'}
                                                height={150}
                                                width="auto"
                                            />
                                            <Card.Body className="p-2">
                                                <hr></hr>
                                                <Card.Title className="text-ad-title">{this.state.title}</Card.Title>
                                                <Card.Text>
                                                    {this.state.mainCategory}
                                                </Card.Text>
                                                <Card.Text className="bold">
                                                    <span className="text-premium">{this.state.price + " €"}</span>  {(this.state.trade ? <span className="text-trade">Trade</span> : "")}
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
                </div>
            </React.Fragment>
        )
    }
}
