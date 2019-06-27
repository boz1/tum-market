import React, { Component } from 'react'
import Title from '../Title'
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Colbar from '../Colbar'

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
            image: '',
            trade: "On",
            showSub: false,
            validated: false
        }

        this.handleMainCatChange = this.handleMainCatChange.bind(this)
        this.getMainCatId = this.getMainCatId.bind(this)
        this.handleSubCatChange = this.handleSubCatChange.bind(this)
        this.handleTitleChange = this.handleTitleChange.bind(this)
        this.handleConditionChange = this.handleConditionChange.bind(this)
        this.handlePriceChange = this.handlePriceChange.bind(this)
        this.handleTradeChange = this.handleTradeChange.bind(this)
        this.handleDescriptionChange = this.handleDescriptionChange.bind(this)
        this.handleSubmit = this.handleSubmit.bind(this)
    }


    handleMainCatChange(event) {
        const mainCat = event.target.value
        this.setState({
            mainCategory: mainCat,
            showSub: true
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
        const form = event.currentTarget;
        if (form.checkValidity() === false) {
            event.preventDefault();
            event.stopPropagation();
        }
        console.log(form)
        this.setState({ validated: true });
    }


    render() {
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

        if (this.props.subCategories.length > 0 && this.state.showSub) {
            let id = this.getMainCatId();
            subCategories.push(<option key="empty" disabled value={''}>Choose...</option>)
            this.props.subCategories[id].map((cat) => subCategories.push(<option key={cat.id + cat.title}>{cat.title}</option>))
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

        const okFeedback = <Form.Control.Feedback>Looks good!</Form.Control.Feedback>
        const invalidDropdownFeedback = <Form.Control.Feedback type="invalid">Please choose a value!</Form.Control.Feedback>
        const invalidTextFeedback = <Form.Control.Feedback type="invalid">Please enter a value!</Form.Control.Feedback>
        const { validated } = this.state;

        return (
            <React.Fragment>
                <div className='col-md-12 d-flex'>
                    <div className="col-md-3 mt-5">
                        <Colbar></Colbar>
                    </div>
                    <div className="col-md-9">
                        <Title title="Create New Advertisement" />
                        <hr className="my-2"></hr>
                        <Form
                            validated={validated}
                            onSubmit={e => this.handleSubmit(e)}>
                            <div className="col-md-12 d-flex p-0">
                                <div className="col-md-9 pl-0">
                                    <div className="d-flex col-sm-12 p-0">
                                        <div className="col-sm-6 pl-0">
                                            <Form.Group>
                                                <Form.Label className="text-sub-title" style={{ fontSize: "16px" }} >Main Category</Form.Label>
                                                {mainCatContainer}
                                                {this.state.mainCategory !== '' ? okFeedback : invalidDropdownFeedback}
                                            </Form.Group>
                                            <Form.Group >
                                                <Form.Label className="text-sub-title" style={{ fontSize: "16px" }}>Sub Category</Form.Label>
                                                {subCatContainer}
                                                {this.state.subCategory !== '' ? okFeedback : invalidDropdownFeedback}
                                            </Form.Group>
                                            <Form.Group>
                                                <Form.Label className="text-sub-title" style={{ fontSize: "16px" }}>Condition</Form.Label>
                                                {conditionsContainer}
                                                {this.state.condition !== '' ? okFeedback : invalidDropdownFeedback}
                                            </Form.Group>
                                        </div>
                                        <div className="col-sm-6 ml-2">
                                            <Form.Group>
                                                <Form.Label className="text-sub-title pl-0" style={{ fontSize: "16px" }}>
                                                    Title
                                                 </Form.Label>
                                                <Form.Control required type="text" placeholder="Title" onChange={this.handleTitleChange} pattern="[a-zA-Z0-9]{5,40}" title="Title can't be less than 5 and more than 40 characters, and can only contain alphanumeric characters." />
                                            </Form.Group>
                                            <div>
                                                <span className="text-sub-title pl-0" style={{ fontSize: "16px" }} >Trade</span>
                                                <label className="ml-4">
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
                                            <Form.Group>
                                                <Form.Label className="text-sub-title pl-0" style={{ fontSize: "16px" }}>
                                                    Price (€)
                                                 </Form.Label>
                                                <Form.Control required type="number" placeholder="€" onChange={this.handlePriceChange} min={0} />
                                            </Form.Group>
                                        </div>
                                    </div>
                                    <div className="my-1">
                                        <Form.Group className="pl-0">
                                            <Form.Label className="text-sub-title" style={{ fontSize: "16px" }}>Description <span style={{color:"#707070", fontSize:"14px"}}>(max 250 characters)</span></Form.Label>
                                            <Form.Control required as="textarea" rows="3" onChange={this.handleDescriptionChange} maxLength="250" placeholder="Descibe your product..."/>
                                        </Form.Group>
                                    </div>
                                </div>
                                <div className="col-md-3 d-block">
                                    <div>
                                        <span className="text-sub-title" style={{ fontSize: "16px" }}>Preview</span>
                                    </div>
                                    <div>
                                        <Button variant="primary" type="submit">
                                            Complete
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        </Form>
                    </div>
                </div>

            </React.Fragment>
        )
    }
}
