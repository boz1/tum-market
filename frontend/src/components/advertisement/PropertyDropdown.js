import React, { Component } from 'react'
import Form from 'react-bootstrap/Form';

export default class PropertyDropdown extends Component {
    constructor(props) {
        super(props)
        this.state = {
            // item: ""
        }
    }

    handleChange = (event) => {
        const item = parseInt(this.refs.ref.value)
        this.props.handleChange(item, this.props.target)
    }

    render() {
        let options = [];

        options.push(<option key="empty" disabled value={''}>Choose...</option>)
        this.props.items.map((item) => options.push(<option key={item.id + item.title} value={item.id}>{item.title}</option>))

        return (
            <div>
                <Form.Group>
                    <Form.Label className="text-sub-title" style={{ fontSize: "16px" }} >{this.props.title}</Form.Label>
                    <Form.Control required as="select" defaultValue={''} onChange={this.handleChange} ref="ref">
                        {options}
                    </Form.Control>
                </Form.Group>
            </div>
        )
    }
}
