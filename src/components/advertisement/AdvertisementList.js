import React, { Component } from 'react'
import Advertisment from './Advertisement'
import Title from '../Title'
import CardDeck from 'react-bootstrap/CardDeck';
import Colbar from '../Colbar'

export default class AdvertisementList extends Component {
    constructor(props) {
        super(props)
        this.state = {
            data:this.props.adsList,
            user:this.props.user
        }
        this.sort=this.sort.bind(this)
        this.componentWillReceiveProps=this.componentWillReceiveProps.bind(this)
    }
    componentWillReceiveProps(){
        this.setState({data:this.props.adsList})
    }
    sort(){
    
    }
    render() {
        return (
            <React.Fragment>
                <div className='col-md-12 d-flex'>
                    <div className="col-md-3 mt-5">
                        <Colbar></Colbar>
                    </div>
                    <div className="col-md-9">
                    <form className="form-inline">
                        <Title title="Marketplace" />
                        <span  style={{paddingLeft:"%"}}>
                        Sort:
                        </span>
                        <span  style={{paddingLeft:"80%"}} onClick={this.sort}>
                            <i class="fa fa-sort-alpha-desc" aria-hidden="true"></i>
                            </span>
                            <span  style={{paddingLeft:"75%"}} onClick={this.state.data.reverse}>
                            <i class="fa fa-sort-alpha-asc" aria-hidden="true"></i>
                        </span>
                        </form>
                        <hr className="my-2"></hr>
                        <CardDeck className="mb-5">
                            {this.state.data.length > 0 ? this.state.data.map((ad) => <Advertisment key={ad.id} ad={ad} user={this.state.user}/>) : ""}
                        </CardDeck>
                    </div>
                </div>
            </React.Fragment>
        )
    }
}
