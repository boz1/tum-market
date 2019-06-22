import React, { Component } from 'react'
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import FormControl from 'react-bootstrap/FormControl';
export default class Search extends Component {
    constructor(props) {
        super(props)
        this.state = {
            ad: this.props.ad
        }
    }
    click(value) {
        console.log(value)
    }
    render() {
        return (
            <div className="ml-auto">
                <Form inline>
                    <FormControl type="text" placeholder="Type in Title, Item No, ..." className="mr-sm-2 search" />
                    <Button onClick={this.click(this.state.ad)}>Filter</Button>
                </Form>
            </div>
        )
    }
}