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
            trade: false,
            showSub: false
        }

        this.handleMainCatChange = this.handleMainCatChange.bind(this)
        this.getMainCatId = this.getMainCatId.bind(this)
        this.handleSubCatChange = this.handleSubCatChange.bind(this)
        this.handleTitleChange = this.handleTitleChange.bind(this)
        this.handleConditionChange = this.handleConditionChange.bind(this)
        this.handlePriceChange = this.handlePriceChange.bind(this)
        this.showResults = this.showResults.bind(this)
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

    getMainCatId() {
        let id;
        this.props.categories.forEach(element => {
            if (element.title === this.state.mainCategory) {
                id = element.id
            }
        });
        return id;
    }

    showResults() {
        console.log(this.state)
    }


    render() {
        let mainCategories = [];
        let subCategories = [];
        let conditions = [];

        let mainCatContainer, subCatContainer, conditionsContainer;

        if (this.props.categories.length > 0) {
            mainCategories.push(<option key="-1" disabled>Choose...</option>)
            this.props.categories.map((cat) => mainCategories.push(<option key={cat.id + cat.title}>{cat.title}</option>))
            mainCatContainer = <Form.Control as="select" defaultValue="Choose..." onChange={this.handleMainCatChange}>
                {mainCategories}
            </Form.Control>
        }

        if (this.props.subCategories.length > 0 && this.state.showSub) {
            let id = this.getMainCatId();
            subCategories.push(<option key="-1" disabled>Choose...</option>)
            this.props.subCategories[id].map((cat) => subCategories.push(<option key={cat.id + cat.title}>{cat.title}</option>))
            subCatContainer = <Form.Control as="select" defaultValue="Choose..." onChange={this.handleSubCatChange}>
                {subCategories}
            </Form.Control>
        }

        if (this.props.conditions.length > 0) {
            conditions.push(<option key="-1" disabled>Choose...</option>)
            this.props.conditions.map((con) => conditions.push(<option key={con.id + con.title}>{con.title}</option>))
            conditionsContainer = <Form.Control as="select" defaultValue="Choose..." onChange={this.handleConditionChange}>
                {conditions}
            </Form.Control>
        }

        return (
            <React.Fragment>
                <div className='col-md-12 d-flex'>
                    <div className="col-md-3 mt-5">
                        <Colbar></Colbar>
                    </div>
                    <div className="col-md-9">
                        <Title title="Create New Advertisement" />
                        <hr className="my-2"></hr>
                        <Form>
                            <div className="col-md-12 d-flex p-0">
                                <div className="col-md-9 pl-0">
                                    <div className="d-flex col-sm-12 p-0">
                                        <div className="col-sm-6 pl-0">
                                            <Form.Group controlId="exampleForm.ControlSelect1">
                                                <Form.Label className="text-sub-title" style={{ fontSize: "16px" }} >Main Category</Form.Label>
                                                {mainCatContainer}
                                            </Form.Group>
                                            <Form.Group controlId="exampleForm.ControlSelect2" >
                                                <Form.Label className="text-sub-title" style={{ fontSize: "16px" }}>Sub Category</Form.Label>
                                                {subCatContainer}
                                            </Form.Group>
                                            <Form.Group controlId="exampleForm.ControlSelect3">
                                                <Form.Label className="text-sub-title" style={{ fontSize: "16px" }}>Condition</Form.Label>
                                                {conditionsContainer}
                                            </Form.Group>
                                        </div>
                                        <div className="col-sm-6 ml-2">
                                            <Form.Group controlId="formHorizontalEmail">
                                                <Form.Label className="text-sub-title pl-0" style={{ fontSize: "16px" }}>
                                                    Title
                                                 </Form.Label>
                                                <Form.Control type="text" placeholder="Title" value={this.state.title} onChange={this.handleTitleChange} />
                                            </Form.Group>

                                            <Form.Group controlId="exampleForm.ControlSelect3">
                                                <Form.Label className="text-sub-title mr-3" style={{ fontSize: "16px" }}>Trade</Form.Label>
                                                <Form.Check inline label="On" type="radio" id='inline-radio-1' className="mr-2" />
                                                <Form.Check inline label="Off" type="radio" id='inline-radio-2' className="m-auto" />
                                            </Form.Group>
                                            <Form.Group controlId="formHorizontalEmail">
                                                <Form.Label className="text-sub-title pl-0" style={{ fontSize: "16px" }}>
                                                    Price
                                                 </Form.Label>
                                                <Form.Control type="number" placeholder="€" value={this.state.price} onChange={this.handlePriceChange} />
                                            </Form.Group>

                                        </div>
                                    </div>
                                    <div className="my-1">
                                        <Form.Group controlId="exampleForm.ControlTextarea1" className="pl-0">
                                            <Form.Label className="text-sub-title" style={{ fontSize: "16px" }}>Description</Form.Label>
                                            <Form.Control as="textarea" rows="3" />
                                        </Form.Group>
                                    </div>
                                </div>
                                <div className="col-md-3 d-block">
                                    <div>
                                        <span className="text-sub-title" style={{ fontSize: "16px" }}>Preview</span>
                                    </div>
                                    <div>
                                        <Button variant="primary" onClick={this.showResults}>
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
