import React, { Component } from 'react';
import { Link } from 'react-router-dom'
import firebase from '../config/firebaseConfig';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import FormControl from 'react-bootstrap/FormControl';
import Dropdown from 'react-bootstrap/Dropdown';
import { Container, Row, Col } from 'reactstrap';

export default class Filter extends Component {
    constructor(props) {
        super(props)
        this.state = {

            mainCategory: '',
            subCategory: '',
            condition: '',
            title: '',
            minPrice: 0,
            maxPrice: 0,
            trade: "On",
        }

        this.handleMainCatChange = this.handleMainCatChange.bind(this)
        this.handleSubCatChange = this.handleSubCatChange.bind(this)
        this.handleTitleChange = this.handleTitleChange.bind(this)
        this.handleConditionChange = this.handleConditionChange.bind(this)
        this.handleMinPriceChange = this.handleMinPriceChange.bind(this)
        this.handleMaxPriceChange = this.handleMaxPriceChange.bind(this)
        this.handleTradeChange = this.handleTradeChange.bind(this)
        this.handleCancel = this.handleCancel.bind(this)
        this.handleSubmit = this.handleSubmit.bind(this)
    }
    componentDidMount() {
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

    handleTitleChange(event) {
        const title = event.target.value
        this.setState({
            title: title
        });
    }

    handleMinPriceChange(event) {
        const price = event.target.value
        this.setState({
            minPrice: price
        });
    }
    handleMaxPriceChange(event) {
        const price = event.target.value
        this.setState({
            maxPrice: price
        });
    }

    handleTradeChange(event) {
        const trade = event.target.value
        this.setState({
            trade: trade
        });
    }

    //not sure if this is also needed to do
    handleCancel() {
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
    
    }

    handleSubmit(event){
        event.preventDefault();
        
        if( this.props.advertisements.length > 0){
            let adds = this.props.advertisements;
            adds = adds.Filter();
        }
        else{

        }

        search(input) {
            if (input.target.value.length === 0)
              this.setState({ sug: this.state.advertisements }, () => this.forceUpdate())
            else {
              const regix = new RegExp(`${input.target.value}`, 'i')
              this.setState({ sug: this.state.advertisements.filter(ad => regix.test(ad.title)) }, () => this.forceUpdate())
            }
        
          }
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


        return (
                <Dropdown className="ml-auto">
                    <Dropdown.Toggle variant="primary" id="dropdown-basic">
                                    Filter
                    </Dropdown.Toggle>
                    <Dropdown.Menu alignRight>
                        <div className="container" style={{width:'300px'}}>
                            <Form id="create-filteredsearch-form">
                                <Form.Group controlId="exampleForm.ControlSelect1">
                                    <Form.Label className="text-primary" style={{ fontSize: "18px" }}>
                                        Category
                                    </Form.Label>
                                    {mainCatContainer}
                                </Form.Group>
                                <Form.Group controlId="exampleForm.ControlSelect2">
                                     <Form.Label  className="text-primary" style={{ fontSize: "18px" }}>
                                        Sub Category
                                    </Form.Label>
                                    {subCatContainer}
                                </Form.Group>
                                <Dropdown.Divider />

                                
                                <Form.Group controlId="exampleForm.ControlSelect3">
                                    <Form.Label className="text-primary" style={{ fontSize: "20px" }}>
                                        Details
                                    </Form.Label>

                                    <Form.Group as={Row} controlId="formPlaintextPassword">
                                        <Form.Label column sm="2" style={{ fontSize: "18px" }}>
                                                Title
                                         </Form.Label>
                                        <Col sm="10">
                                            <Form.Control maxLength="40" required type="text" placeholder="Title" onChange={this.handleTitleChange} pattern="[a-zA-Z0-9\s]{5,40}" title="Title can't be less than 5 and more than 40 characters, and can only contain alphanumeric characters." />
                                        </Col>
                                    </Form.Group>
                               

                                    <Form.Group as={Row} controlId="formPlaintextEmail">
                                        <Form.Label column sm="4" style={{ fontSize: "18px" }}>
                                            Price (€) 
                                        </Form.Label>
                                        <Col sm="2">
                                            <div class="form-row">
                                                <div class="col">
                                                    <input type="number" placeholder="min" min="0" max="100000000" step="1"/>     
                                                </div>
                                                <div class="col">
                                                    <input type="number" placeholder="max" min="0" max="100000000" step="1"/>     
                                                </div>
                                            </div>    
                                        </Col>
                                    </Form.Group>
                                

                                    <Form.Group controlId="condition">
                                        <Form.Label style={{ fontSize: "18px" }}>
                                            Condition
                                        </Form.Label>
                                        {conditionsContainer}
                                    </Form.Group>
                                    
                                    <Form.Group controlId="Trade">
                                        <Form.Label style={{ fontSize: "18px" }}>
                                            Open for Trade
                                        </Form.Label>
                                        <div>
                                        <div className="custom-control custom-radio custom-control-inline">
                                            <input type="radio" id="customRadioInline1" name="customRadioInline1" className="custom-control-input"/>
                                            <label className="custom-control-label" for="customRadioInline1">Yes</label>
                                        </div>
                                        <div className="custom-control custom-radio custom-control-inline">
                                            <input type="radio" id="customRadioInline2" name="customRadioInline1" className="custom-control-input"/>
                                            <label className="custom-control-label" for="customRadioInline2">No</label>
                                        </div>
                                        </div>
                                    </Form.Group>
                                </Form.Group>

                                <div class="form-row">
                                    <div class="col">
                                    <Button variant= "danger" as="input" type="reset" value="Clear" />
                                    </div>
                                    <div class="col">
                                        <Button variant="success"  type="submit">Filter</Button>
                                    </div>
                                </div>
                            </Form>
                        </div>
                    </Dropdown.Menu>
                </Dropdown>
       )
    }
}
 
