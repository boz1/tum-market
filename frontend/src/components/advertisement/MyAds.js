import React, { Component } from 'react'
import AdvertisementList from './AdvertisementList'

export default class MyAds extends Component {
    constructor(props) {
        super(props)
        this.state = {
            data:{},
            mysearch:{}
        }
        this.search=this.search.bind(this)
    }

    componentWillReceiveProps() {
        this.setState({ data: this.props.getAds(),mysearch:this.props.getAds() })
    }
    search(input){
        if (input.target.value.length === 0)
            this.setState({ mysearch: this.props.getAds() }, () => this.forceUpdate())
      else {
        const regix = new RegExp(`${input.target.value}`, 'i')
        this.setState({ mysearch: this.props.getAds().filter(ad => regix.test(ad.title)) }, () => this.forceUpdate())
      }
    }
    render() {
        return (
            <div>
            <input onChange={this.search} type="text" placeholder="Search your ad.."  style={{marginLeft:"27%",marginTop:"10px"}}/>
            <React.Fragment>
                <AdvertisementList title="My Advertisements" adsList={this.state.mysearch} user={this.props.user} categories={this.props.categories} subCategories={this.props.subCategories} conditions={this.props.conditions}/>
            </React.Fragment >
            </div>
        )
    }
}
