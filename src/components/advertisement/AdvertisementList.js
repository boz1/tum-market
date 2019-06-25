import React, { Component } from 'react'
import Advertisment from './Advertisement'
import Title from '../Title'
import CardDeck from 'react-bootstrap/CardDeck';
import Colbar from '../Colbar'
import MaterialIcon, {colorPalette} from 'material-icons-react';

export default class AdvertisementList extends Component {
    constructor(props) {
        super(props)
        this.state = {
        }
    }

    render() {
        let data = this.props.adsList;
        const user = this.props.user;

        return (
            <React.Fragment>
                <div className='col-md-12 d-flex'>
                    <div className="col-md-3 mt-5">
                        <Colbar></Colbar>
                    </div>
                    <div className="col-md-9">
                    <form className="form-inline">
                        <Title title="Marketplace" /><span  style={{paddingLeft:"80%"}} onClick={data.reverse}><MaterialIcon icon="sort_by_alpha"  /></span>
                        </form>
                        <hr className="my-2"></hr>
                        <CardDeck className="mb-5">
                            {data.length > 0 ? data.map((ad) => <Advertisment key={ad.id} ad={ad} user={user}/>) : ""}
                        </CardDeck>
                    </div>
                </div>
            </React.Fragment>
        )
    }
}
