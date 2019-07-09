import React, { Component } from 'react'
import AdvertisementList from './AdvertisementList'

export default class Marketplace extends Component {
    constructor(props) {
        super(props)
        this.state = {
        }
    }

    render() {
        return (
            <React.Fragment>
                <AdvertisementList reRender={this.props.reRender} title="Seller's Market" adsList={this.props.adsList} user={this.props.user} categories={this.props.categories} subCategories={this.props.subCategories} conditions={this.props.conditions} />
            </React.Fragment >
        )
    }
}
