import React, { Component } from 'react'
import BuyList from './BuyList'

export default class BuyMarket extends Component {
    constructor(props) {
        super(props)
        this.state = {
        }
    }


    render() {
        this.props.updateMarket('buyers')

        return (
            <React.Fragment>
                <BuyList getCategory={this.props.getCategory} changeMarket={this.props.changeMarket} reRender={this.props.reRender} title="Buyer's Market" buyingRequests={this.props.buyingRequests} user={this.props.user} categories={this.props.categories} subCategories={this.props.subCategories} />
            </React.Fragment >
        )
    }
}
