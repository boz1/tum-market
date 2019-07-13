import React, { Component } from 'react'

export default class Verification extends Component {
    redirect = (e) => {
        console.log("redirecting....")
    }

    render() {
        return (
            <div className="container mt-5">
                <div className="mx-auto my-auto p-4 w-50 login-border text-center">
                    <span style={{fontSize:"16px"}}>Please check your inbox.</span>
                    <hr></hr>
                    <form onSubmit={e => this.redirect(e)}>
                        <div>
                            <div>
                                <button type="submit" className="btn btn-primary  text-center">
                                    Login
                                </button>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        )
    }
}
