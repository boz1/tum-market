import React, { Component } from 'react'
import AdvertisementList from './AdvertisementList'

export default class Marketplace extends Component {
    constructor(props) {
        super(props)
        this.state = {
            data: this.props.getAds
        }
    }

    componentWillReceiveProps() {
        this.setState({ data: this.props.getAds })
    }

    render() {
        return (
            <React.Fragment>
                <AdvertisementList title="Marketplace" adsList={this.props.adsList} user={this.props.user} categories={this.props.categories} subCategories={this.props.subCategories} conditions={this.props.conditions} />
            </React.Fragment >
        )
    }
}
