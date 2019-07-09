import React, { Component } from 'react'
import BuyList from './BuyList'

export default class MyBuyingRequests extends Component {
    constructor(props) {
        super(props)
        this.state = {
            data: this.props.getBuyingRequests()
        }
    }

    componentWillReceiveProps() {
        this.setState({ data: this.props.getBuyingRequests() })
    }

    render() {
        return (
            <React.Fragment>
                <BuyList title="My Buying Requests" reRender={this.props.reRender} buyingRequests={this.state.data} user={this.props.user} categories={this.props.categories} subCategories={this.props.subCategories} />
            </React.Fragment >
        )
    }
}
