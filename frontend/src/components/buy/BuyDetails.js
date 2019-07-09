import React, { Component } from 'react'
import Title from '../Title'
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';
import history from '../../history'
import Edit from './Edit';
import Modal from 'react-bootstrap/Modal';
import { css } from '@emotion/core';
import { RingLoader } from 'react-spinners';
import ConfirmationModal from '../ConfirmationModal'
import BuyingRequestService from '../../services/BuyingRequestService'

const override = css`
    display: block;
    margin: 0 auto;
    border-color: red;
`;

export default class BuyDetails extends Component {
    constructor(props) {
        super(props)
        this.state = {
            showModal: false,
            showDeleteModal: false,
            showEditModal: false,
            loading: false
        }

        this.handleClose = this.handleClose.bind(this)
    }

    handleDelete = (event) => {
        event.preventDefault()
        this.setState({
            loading: true,
        })

        const buyingRequest = this.props.location.state.buyingRequest;

        this.deleteBuyingRequest(buyingRequest)
    }

    deleteBuyingRequest = (buyingRequest) => {
        BuyingRequestService.deleteBuyingRequest(buyingRequest).then((msg) => {
            this.props.location.func()
            history.push('/myBuy')
        }).catch((e) => {
            console.log(e);
        });
    }

    showDeleteModal = (e) => {
        e.preventDefault();
        this.setState({ showDeleteModal: true })
    }

    showEditModal = (e) => {
        e.preventDefault();
        this.setState({
            showEditModal: true
        })
    }

    handleClose() {
        this.setState({ showModal: false, showDeleteModal: false, showEditModal: false });
    }

    render() {
        const buyingRequest = this.props.location.state.buyingRequest;
        const buyingRequestOwner = buyingRequest.user;
        const user = this.props.location.state.user;
        let actionField;

        let loading = <Modal show={this.state.loading}>
            <Modal.Body>
                <RingLoader
                    css={override}
                    sizeUnit={"px"}
                    size={100}
                    color={'#006BD6'}
                    loading={this.state.loading}
                />
            </Modal.Body>
        </Modal>

        let items = [];
        items.push(<option key="empty" disabled value={''}>Choose...</option>)

        if (user.ads !== null & user.ads !== undefined) {
            Object.values(user.ads).map((item) => items.push(<option key={item.id} value={item.title + '&' + item.id}>{item.title}</option>))
        }

        const delTxt = <span>Are you sure to delete this buying request?</span>
        const deleteModal = <span><ConfirmationModal show={this.state.showDeleteModal} onHide={this.handleClose} title="Delete Buying Request" txt={delTxt} onClickClose={this.handleClose} onClickConfirm={this.handleDelete} />
            {loading}</span>

        const editModal = <Edit show={this.state.showEditModal} close={this.handleClose} user={this.props.location.state.user} buyingRequest={this.props.location.state.buyingRequest} categories={this.props.location.state.categories} subCategories={this.props.location.state.subCategories} reRender={this.props.location.func} />

        if (user.info.id === buyingRequest.userId) {
            actionField = <div className="mt-3">
                <Card style={{ width: '18rem', background: 'whitesmoke' }} className="mt-2">
                    <Card.Body className="d-block m-auto">
                        <div>
                            <Button variant="danger" type="submit" onClick={this.showDeleteModal}>
                                Delete
                            </Button>
                            <Button variant="primary" type="submit" className="float-right ml-5" onClick={this.showEditModal}>
                                Edit
                            </Button>
                        </div>
                    </Card.Body>
                </Card>
            </div>;
        }

        return (
            <React.Fragment>
                <div className="container">
                    <Title title={buyingRequest.title} />
                    <hr className="my-2"></hr>
                    <div className="row">
                        <div className="col-md-12 d-flex p-0">
                            <div className="col-md-8">
                                <span className="text-sub-title">Details</span>
                                <div className="d-flex mt-2 col-sm-12 p-0 detail-div">
                                    <div className="col-sm-6 my-3">
                                        <ul className="align-content-center category-list details-list">
                                            <li className="center-item"><span className="float-left">ID</span><strong>{buyingRequest.id}</strong></li>
                                            <hr></hr>
                                            <li className="center-item"><span className="float-left">Date Added</span><strong>{buyingRequest.dateAdded.split(' ')[0]}</strong></li>
                                            <hr></hr>
                                            <li className="center-item"><span className="float-left">Main Category</span><strong>{buyingRequest.mainCategory.title}</strong></li>
                                            <hr></hr>
                                            <li className="center-item"><span className="float-left">Sub Category</span><strong>{buyingRequest.subCategory.title}</strong></li>
                                            <hr></hr>
                                            <li className="center-item"><span className="float-left">Price</span><strong>{buyingRequest.price + " €"}</strong></li>
                                        </ul>
                                    </div>
                                </div>
                                <div className="my-3">
                                    <Card>
                                        <Card.Header><span className="text-sub-title">Description</span></Card.Header>
                                        <Card.Body style={{ fontSize: "16px" }}>
                                            <p>
                                                {' '}
                                                {buyingRequest.description}{' '}
                                            </p>
                                        </Card.Body>
                                    </Card>
                                </div>
                            </div>
                            <div className="col-md-4 d-block">
                                <div>
                                    <span className="text-sub-title">Contact</span>
                                    <Card style={{ width: '18rem', background: 'oldlace' }} className="mt-2">
                                        <Card.Body>
                                            <div className="d-flex bold text-premium">
                                                <div>
                                                    <Card.Title >{buyingRequestOwner.name}</Card.Title>
                                                </div>
                                                <div className="ml-auto">
                                                    {buyingRequestOwner.isPremium ? "Premium" : ""}
                                                </div>
                                            </div>
                                            <div>
                                                <Card.Text className="d-block mb-1">
                                                    {buyingRequestOwner.address}
                                                </Card.Text>
                                            </div>
                                            <div className="d-block">
                                                <div>
                                                    {buyingRequestOwner.telephone}
                                                </div>
                                                <div>
                                                    {buyingRequestOwner.email}
                                                </div>
                                            </div>
                                        </Card.Body>
                                    </Card>
                                </div>
                                {actionField}
                            </div>
                        </div>
                        {deleteModal}
                        {editModal}
                    </div>
                </div>
            </React.Fragment>
        )
    }
}
