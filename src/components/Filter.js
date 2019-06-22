import React, { Component } from 'react';
import { Link } from 'react-router-dom'
import firebase from '../config/firebaseConfig';
import logo from '../logo.svg'
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import FormControl from 'react-bootstrap/FormControl';
import Dropdown from 'react-bootstrap/Dropdown';

class Filter extends Component {
    constructor(props) {
        super(props)
        this.state = {
        }

    }
    state = {  }
    render() { 
        return (
                <Dropdown className="ml-auto">
                    <Dropdown.Toggle variant="primary" id="dropdown-basic">
                                    Filter
                    </Dropdown.Toggle>
                    <Dropdown.Menu alignRight>
                        <div className="container" style={{width:'300px'}}>
                            <Form>
                                <Form.Group controlId="exampleForm.ControlSelect1">
                                    <Form.Label>Main Category</Form.Label>
                                    <Form.Control as="select" >
                                    <option>1</option>
                                    <option>2</option>
                                    <option>3</option>
                                    </Form.Control>
                                </Form.Group>
                                <Form.Group controlId="exampleForm.ControlSelect2">
                                    <Form.Label>Sub Category</Form.Label>
                                    <Form.Control as="select">
                                    <option>1</option>
                                    <option>2</option>
                                    <option>3</option>
                                    </Form.Control>
                                </Form.Group>
                                <Dropdown.Divider />

                                
                                <Form.Group controlId="exampleForm.ControlSelect3">
                                    <Form.Label>Details</Form.Label>
                                    <div className="form-group row">
                                        <label for="inputEmail3" className="col-sm-2 col-form-label">Title</label>
                                        <div className="col-sm-10">
                                            <input type="title" className="form-control" id="inputEmail3" placeholder="Title"/>
                                        </div>
                                    </div>

                                    <Form.Group controlId="exampleForm.ControlSelect3">
                                    <Form.Label>Trade</Form.Label>
                                    <div className="custom-control custom-radio custom-control-inline">
                                        <input type="radio" id="customRadioInline1" name="customRadioInline1" className="custom-control-input"/>
                                        <label className="custom-control-label" for="customRadioInline1">Yes</label>
                                    </div>
                                    <div className="custom-control custom-radio custom-control-inline">
                                        <input type="radio" id="customRadioInline2" name="customRadioInline1" className="custom-control-input"/>
                                        <label className="custom-control-label" for="customRadioInline2">No</label>
                                    </div>
                                </Form.Group>

                                </Form.Group>
                                <Button variant="danger">Cancel</Button>
                                <Button variant="success">Submit</Button>
                            </Form>
                        </div>
                    </Dropdown.Menu>
                </Dropdown>
       )
    }
}
 
export default Filter;