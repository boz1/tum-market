import React, { Component } from 'react'
import Advertisment from './Advertisement'
import Title from '../Title'
import CardDeck from 'react-bootstrap/CardDeck';
import Colbar from '../Colbar'

export default class AdvertisementList extends Component {
    constructor(props) {
        super(props)
        this.state = {
            advertisements: this.props.adsList
        }
    }

    render() {
        const data = this.props.adsList;
        return (
            <React.Fragment>
                <div className='col-md-12 d-flex'>
                    <div className="col-md-3">
                        <Colbar></Colbar>
                    </div>
                    <div className="col-md-9">
                        <Title title="Marketplace" />
                        <hr></hr>
                        <CardDeck className="mb-5">
                            {data.length > 0 ? data.map((d) => <Advertisment key={d.title} ad={d} />) : ""}
                        </CardDeck>
                    </div>
                </div>
            </React.Fragment>
        )
    }
}
