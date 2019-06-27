import React, { Component } from 'react'
import Advertisment from './Advertisement'
import Title from '../Title'
import CardDeck from 'react-bootstrap/CardDeck';
import Colbar from '../Colbar'

export default class AdvertisementList extends Component {
    constructor(props) {
        super(props)
        this.state = {
            data: this.props.adsList,
            user: this.props.user
        }
        this.sort=this.sort.bind(this)
        this.componentWillReceiveProps=this.componentWillReceiveProps.bind(this)
        this.dynamicSort=this.dynamicSort.bind(this)
    }
    componentWillReceiveProps(){

        this.setState({data:this.props.adsList})}
    dynamicSort(property) {
        var sortOrder = 1;
    
        if(property[0] === "-") {
            sortOrder = -1;
            property = property.substr(1);
        }
    
        return function (a,b) {
            if(sortOrder == -1){
                return b[property].localeCompare(a[property]);
            }else{
                return a[property].localeCompare(b[property]);
            }        
        }
    }
    sort(){
        // this.setState({data:this.state.data.sort(this.dynamicSort("title"))})    
    }
    render() {
        console.log(this.state.data)
        return (
            <React.Fragment>
                <div className='col-md-12 d-flex'>
                    <div className="col-md-3 mt-5">
                        <Colbar></Colbar>
                    </div>
                    <div className="col-md-9">
                        <form className="form-inline">
                            <Title title="Marketplace" />
                            <span style={{ paddingLeft: "%" }}>
                                Sort:
                            </span>
                            <span style={{ paddingLeft: "80%" }} onClick={this.sort}>
                                <i className="fa fa-sort-alpha-desc" aria-hidden="true"></i>
                            </span>
                            <span style={{ paddingLeft: "75%" }} onClick={data.reverse}>
                                <i className="fa fa-sort-alpha-asc" aria-hidden="true"></i>
                            </span>
<<<<<<< HEAD
                            <span  style={{paddingLeft:"75%"}} onClick={this.sort}>
                            <i class="fa fa-sort-alpha-asc" aria-hidden="true"></i>
                        </span>
                        </form>
                        <hr className="my-2"></hr>
                        <CardDeck className="mb-5">
                            {this.state.data.length > 0 ? this.state.data.map((ad) => <Advertisment key={ad.id} ad={ad} user={this.state.user}/>) : ""}
=======
                        </form>
                        <hr className="my-2"></hr>
                        <CardDeck className="mb-5">
                            {data.length > 0 ? data.map((ad) => <Advertisment key={ad.id} ad={ad} user={this.state.user} />) : ""}
>>>>>>> dd5f585ace588bd4878453e75d7fa7a9460aa077
                        </CardDeck>
                    </div>
                </div>
            </React.Fragment>
        )
    }
}
