import React, { Component } from 'react'
import Advertisment from './Advertisement'
import Title from '../Title'

export default class AdvertisementList extends Component {
    constructor(props) {
        super(props)
        this.state = {
            advertisements: this.props.adsList
        }
    }

    componentDidMount(){
        
    }

    getDataComponent = (data) => {
        return <li key={data}>{data.title}</li>;
    }

    

    render() {
        const data = this.props.adsList;
        return (
            <React.Fragment>
                <Title title="Marketplace" />
                <hr></hr>
                <div>
                    {data.length > 0 ? data.map((d) => <li key={d.title}>{d.title}</li>) : ""}
                </div>
            </React.Fragment>
        )
    }
}
