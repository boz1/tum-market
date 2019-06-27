import React, { Component } from 'react'
import Advertisment from './Advertisement'
import Title from '../Title'
import CardDeck from 'react-bootstrap/CardDeck';
import Colbar from '../Colbar'
import Dropdown from 'react-bootstrap/Dropdown';

export default class AdvertisementList extends Component {
    constructor(props) {
        super(props)
        this.state = {
            data: this.props.adsList,
            user: this.props.user
        }
        this.sortAZ=this.sortAZ.bind(this)
        this.sortZA=this.sortZA.bind(this)
        this.componentWillReceiveProps=this.componentWillReceiveProps.bind(this)
        this.dynamicSort=this.dynamicSort.bind(this)
        this.pricesort=this.pricesort.bind(this)
    }
    componentWillReceiveProps(){
        this.setState({data:this.props.adsList})
    }
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
    sortAZ(){
        this.setState({data:this.state.data.sort(this.dynamicSort("title"))})    
    }
    sortZA(){
        this.setState({data:this.Numberstate.data.sort(this.dynamicSort("-title"))})    
    }
    pricesort(){
        this.setState({data:this.state.data.sort(function(obj1, obj2) {return Number (obj1.price) - Number(obj2.price)})})}
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
                            <span style={{ paddingLeft: "80%" }} class="dropdown">
                            <Dropdown className="ml-auto">
                    <Dropdown.Toggle variant="info" id="dropdown-basic">Sort</Dropdown.Toggle>
                    <Dropdown.Menu alignRight>
                        <Dropdown.Item onClick={this.sortAZ}>A-Z</Dropdown.Item>
                        <Dropdown.Item onClick={this.sortZA}>Z-A</Dropdown.Item>
                        <Dropdown.Item onClick={this.pricesort}>Price</Dropdown.Item>
                        <Dropdown.Item >Date</Dropdown.Item>
                    </Dropdown.Menu>
                </Dropdown>
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
