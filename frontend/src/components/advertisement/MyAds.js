import React, { Component } from 'react'
import AdvertisementList from './AdvertisementList'
import Form from 'react-bootstrap/Form';
import FormControl from 'react-bootstrap/FormControl';

export default class MyAds extends Component {
    constructor(props) {
        super(props)
        this.state = {
            mysearch: this.props.getAds()
        }
        this.search = this.search.bind(this)
    }

    componentWillReceiveProps() {
        this.setState({ mysearch: this.props.getAds() })
    }

    search(input) {
        if (input.target.value.length === 0)
            this.setState({ mysearch: this.props.getAds() }, () => this.forceUpdate())
        else {
            const regix = new RegExp(`${input.target.value}`, 'i')
            this.setState({ mysearch: this.props.getAds().filter(ad => regix.test(ad.title)) }, () => this.forceUpdate())
        }
    }

    render() {
        this.props.updateMarket('sellers')

        const search = <Form inline>
            <FormControl className="mr-sm-2 search" onChange={this.search} type="text" placeholder="Search your ads..." style={{ marginLeft: "27%", marginTop: "10px" }} />
        </Form>

        return (
            <div>
                <React.Fragment>
                        <AdvertisementList title="My Advertisements" getCategory={this.props.getCategory} searchBar = {search} reRender={this.props.reRender} adsList={this.state.mysearch} user={this.props.user} categories={this.props.categories} subCategories={this.props.subCategories} conditions={this.props.conditions} />
                </React.Fragment >
            </div>
        )
    }
}
