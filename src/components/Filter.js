import React, { Component } from 'react';
import { Link } from 'react-router-dom'
import firebase from '../config/firebaseConfig';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import FormControl from 'react-bootstrap/FormControl';
import Dropdown from 'react-bootstrap/Dropdown';
class Filter extends Component {
    constructor(props) {
        super(props)
        this.state = {
            advertisements: {},
            sug: {},
            categories: {},
            selectedCategory: "",
            subCategories: {},
            conditions: {},
        }


    this.getAdvertisements = this.getAdvertisements.bind(this)
    this.getCategories = this.getCategories.bind(this)
    this.getSubCategories = this.getSubCategories.bind(this)
    this.getConditions = this.getConditions.bind(this)
    }
    componentDidMount() {
        this.getCategories()
        this.getSubCategories()
        this.getConditions()
        this.getAdvertisements()
      }


      getCategories() {
        this.categoriesRef = firebase.database().ref('categories')
        this.categoriesRef.on('value', snap => {
          this.setState({
            categories: snap.val()
          })
        })
      }
      getSubCategories() {
        this.subCategoriesRef = firebase.database().ref('sub-categories')
        this.subCategoriesRef.on('value', snap => {
          this.setState({
            subCategories: snap.val()
          })
        })
      }
    
      getConditions() {
        this.conditionsRef = firebase.database().ref('conditions')
        this.conditionsRef.on('value', snap => {
          this.setState({
            conditions: snap.val()
          })
        })
      }
      getAdvertisements(){

      }
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
                                    <select value={this.state.selectedCategory} 
              onChange={(e) => this.setState({selectedCategory: e.target.value})}>
        {this.state.categories((category) => <option key={category.value} value={category.value}>{category.display}</option>)}
      </select>
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
                                  
                                    
                                    <div class="form-row">
                                        
                                        <div class="col">
                                            <input type="number" placeholder="minPrice" min="0" max="100000000" step="1"/>     
                                        </div>
                                        <div class="col">
                                            <input type="number" placeholder="maxPrice" min="0" max="100000000" step="1"/>     
                                        </div>
                                    </div>

                                </Form.Group>
                                <Form.Group controlId="condition">
                                    <Form.Label>Condition</Form.Label>
                                    <Form.Control as="select">
                                    <option>As new</option>
                                    <option>Mint</option>
                                    </Form.Control>
                                </Form.Group>
                                <Form.Group controlId="Trade">
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
                                
                                <div class="form-row">
                                    <div class="col">
                                        <Button variant="danger">Cancel</Button>
                                    </div>
                                    <div class="col">
                                        <Button variant="success">Submit</Button>
                                    </div>
                                </div>
                            </Form>
                        </div>
                    </Dropdown.Menu>
                </Dropdown>
       )
    }
}
 
export default Filter;