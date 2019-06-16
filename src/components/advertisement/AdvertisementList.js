import React, { Component } from 'react'
import Advertisment from './Advertisement'
import Title from '../Title'
import CardDeck from 'react-bootstrap/CardDeck';


export default class AdvertisementList extends Component {
    constructor(props) {
        super(props)
        this.state = {
            advertisements: this.props.adsList
        }
    }

    // getItem = (data) => {
    //     return (
    //         <Advertisment ad = {data}/>
    //     );
    // }

    render() {
        const data = this.props.adsList;
        return (
            <React.Fragment>
                <div className="container">
                    <Title title="Marketplace" />
                    <hr></hr>
                    <CardDeck>
                        {data.length > 0 ? data.map((d) => <Advertisment key={d.title} ad={d} />) : ""}
                    </CardDeck>
                </div>
            </React.Fragment>
        )
    }
}
