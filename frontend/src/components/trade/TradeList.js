import React, { Component } from 'react'
import Title from '../Title'
import CardDeck from 'react-bootstrap/CardDeck';
import Colbar from '../Colbar'
import TradeRequest from './TradeRequest'

export default class TradeList extends Component {
    constructor(props) {
        super(props)
        this.state = {
        }
    }

    render() {
        const receivedOffers = this.props.user.receivedOffers;
        const sentOffers = this.props.user.tradeReq;

        return (
            <React.Fragment>
                <div className='col-md-12 d-flex'>
                    <div className="col-md-3 mt-5">
                        <Colbar></Colbar>
                    </div>
                    <div className="col-md-9">
                        <Title title="My Trade Requests" />
                        <hr className="my-2"></hr>
                        <div className="d-block mb-5">
                            <CardDeck>
                                {receivedOffers !== undefined && receivedOffers !== null ? (receivedOffers.length > 0 ? receivedOffers.map((item) => <TradeRequest key={item.id} item={item} user={this.props.user.info} reRender={this.props.reRender} type="received" />) : "") : ""}
                            </CardDeck>
                            <CardDeck>
                                {sentOffers !== undefined && sentOffers !== null ? (sentOffers.length > 0 ? sentOffers.map((item) => <TradeRequest key={item.id} item={item} user={this.props.user.info} reRender={this.props.reRender} type="sent" />) : "") : ""}
                            </CardDeck>
                            <div style={{textAlign:'center', fontSize:"16px"}}>{sentOffers !== undefined && sentOffers !== null && sentOffers.length === 0 && receivedOffers !== undefined && receivedOffers !== null && receivedOffers.length === 0 ? "No trade requests found." : ""}</div>
                        </div>

                    </div>
                </div>
            </React.Fragment >
        )
    }
}
