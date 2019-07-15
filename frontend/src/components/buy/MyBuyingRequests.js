import React, { Component } from 'react'
import BuyList from './BuyList'
import Form from 'react-bootstrap/Form';
import FormControl from 'react-bootstrap/FormControl';

export default class MyBuyingRequests extends Component {
    constructor(props) {
        super(props)
        this.state = {
            data: this.props.getBuyingRequests()
        }
        this.search = this.search.bind(this)
    }

    componentWillReceiveProps() {
        this.setState({ data: this.props.getBuyingRequests() })
    }

    search(input) {
        if (input.target.value.length === 0)
            this.setState({ data: this.props.getBuyingRequests() }, () => this.forceUpdate())
        else {
            const regix = new RegExp(`${input.target.value}`, 'i')
            this.setState({ data: this.props.getBuyingRequests().filter(buy => regix.test(buy.title)) }, () => this.forceUpdate())
        }
    }

    render() {
        this.props.updateMarket('buyers')
        const search = <Form inline>
        <FormControl className="search" onChange={this.search} type="text" placeholder="Search your requests..." style={{ marginLeft: "20%", marginTop: "10px" }} />
        </Form>
        return (
            <React.Fragment>
                <BuyList title="My Buying Requests"getCategory={this.props.getCategory}  searchBar={search} reRender={this.props.reRender} buyingRequests={this.state.data} user={this.props.user} categories={this.props.categories} subCategories={this.props.subCategories} />
            </React.Fragment >
        )
    }
}
