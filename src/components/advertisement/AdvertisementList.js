import React, { Component } from 'react'
import Advertisment from './Advertisement'
import Title from '../Title'
import CardDeck from 'react-bootstrap/CardDeck';
import Colbar from '../Colbar'
import Dropdown from 'react-bootstrap/Dropdown';
import ReactPaginate from 'react-paginate';

export default class AdvertisementList extends Component {
    constructor(props) {
        super(props)
        this.state = {
            data: this.props.adsList,
            user: this.props.user,
            itemPerPage: 6,
            currentPage: 0,
            pageCount: Math.ceil(this.props.adsList.length / 6)
        }

        this.sortAZ = this.sortAZ.bind(this)
        this.sortZA = this.sortZA.bind(this)
        this.componentWillReceiveProps = this.componentWillReceiveProps.bind(this)
        this.dynamicSort = this.dynamicSort.bind(this)
        this.pricesort = this.pricesort.bind(this)
        this.pricesortReverse = this.pricesortReverse.bind(this)
        this.datesort = this.datesort.bind(this)
        this.datesortReverse = this.datesortReverse.bind(this)
        this.getData = this.getData.bind(this)
    }

    componentWillReceiveProps() {
        this.setState({ data: this.props.adsList, pageCount: Math.ceil(this.props.adsList.length / this.state.itemPerPage) })
    }

    dynamicSort(property) {
        var sortOrder = 1;

        if (property[0] === "-") {
            sortOrder = -1;
            property = property.substr(1);
        }

        return function (a, b) {
            if (sortOrder === -1) {
                return b[property].localeCompare(a[property]);
            } else {
                return a[property].localeCompare(b[property]);
            }
        }
    }

    sortAZ() {
        this.setState({ data: this.state.data.sort(this.dynamicSort("title")), sort: "A-Z" })
    }

    sortZA() {
        this.setState({ data: this.state.data.sort(this.dynamicSort("-title")), sort: "Z-A" })
    }

    pricesort() {
        this.setState({ data: this.state.data.sort(function (obj1, obj2) { return Number(obj1.price) - Number(obj2.price) }), sort: "€-€€€" })
    }

    pricesortReverse() {
        this.setState({ data: this.state.data.sort(function (obj1, obj2) { return Number(obj1.price) - Number(obj2.price) }).reverse(), sort: "€€€-€" })
    }

    datesort() {
        this.setState({ data: this.state.data.sort(function (obj1, obj2) { return Number(obj1.date.replace('/', '')) - Number(obj2.date.replace('/', '')) }), sort: "Old to New" })
    }

    datesortReverse() {
        this.setState({ data: this.state.data.sort(function (obj1, obj2) { return Number(obj1.date.replace('/', '')) - Number(obj2.date.replace('/', '')) }).reverse(), sort: "New to Old" })
    }

    handlePageClick = data => {
        let selected = data.selected;
        this.setState({ currentPage: selected })
    };

    getData() {
        const bottomLimit = this.state.currentPage * this.state.itemPerPage
        const topLimit = (this.state.currentPage + 1) * this.state.itemPerPage
        let pageData = this.state.data.slice(bottomLimit, topLimit)
        pageData.sort(function (obj1, obj2) {
            return (obj1.user.isPremium === obj2.user.isPremium) ? 0 : obj1 ? -1 : 1;
        });
        return pageData.map((ad) => <Advertisment key={ad.id} ad={ad} user={this.state.user} />)
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
                            <div className="row mt-2 ml-auto">
                                <div className="col-12">
                                    <span style={{ fontSize: "16px", paddingTop: "7px", color: "#2A2525" }}>{this.state.sort}</span>
                                    <Dropdown style={{ background: "#3482D1", borderRadius: "0.25rem", marginLeft: "20px" }}>
                                        <Dropdown.Toggle variant="info" id="dropdown-basic">Sort By</Dropdown.Toggle>
                                        <Dropdown.Menu alignRight>
                                            <Dropdown.Item onClick={this.sortAZ}>A-Z</Dropdown.Item>
                                            <Dropdown.Item onClick={this.sortZA}>Z-A</Dropdown.Item>
                                            <Dropdown.Item onClick={this.pricesort}>€-€€€</Dropdown.Item>
                                            <Dropdown.Item onClick={this.pricesortReverse}>€€€-€</Dropdown.Item>
                                            <Dropdown.Item onClick={this.datesort}>Old to New</Dropdown.Item>
                                            <Dropdown.Item onClick={this.datesortReverse}>New to Old</Dropdown.Item>
                                        </Dropdown.Menu>
                                    </Dropdown>
                                </div>
                            </div>

                        </form>
                        <hr className="my-2"></hr>
                        <CardDeck className="mb-5 row">
                            {this.state.data.length > 0 ? this.getData() : <div style={{textAlign:'center', fontSize:"16px", margin:"auto"}}>No advertisements found.</div>}
                        </CardDeck>
                        {this.state.data.length > 0 ?
                            <div className="my-2" style={{ background: "#D0E4F7" }}>
                                <span>
                                    <ReactPaginate
                                        previousLabel={'<'}
                                        nextLabel={'>'}
                                        breakLabel={'...'}
                                        breakClassName={'break-me'}
                                        pageCount={this.state.pageCount}
                                        marginPagesDisplayed={2}
                                        pageRangeDisplayed={5}
                                        onPageChange={this.handlePageClick}
                                        containerClassName={'pagination'}
                                        subContainerClassName={'pages pagination'}
                                        activeClassName={'active'}
                                        nextClassName={'prev-next'}
                                        previousClassName={'prev-next'}
                                        previousLinkClassName={'text-decoration-none'}
                                        nextLinkClassName={'text-decoration-none'}
                                        pageLinkClassName={'page-link'}
                                        pageClassName={'page'}
                                        activeLinkClassName={'active-link'}
                                    />
                                </span>
                            </div> : ""}
                    </div>
                </div>
            </React.Fragment >
        )
    }
}
