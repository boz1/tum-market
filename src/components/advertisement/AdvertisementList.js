import React, { Component } from 'react'
import Advertisment from './Advertisement'
import Title from '../Title'

export default class AdvertisementList extends Component {
    constructor(props) {
        super(props)
        this.state = {
            advertisements: []
        }
    }
    render() {
        return (
            <React.Fragment>
                <Title title="Marketplace" />
                <hr></hr>
            </React.Fragment>
        )
    }
}
