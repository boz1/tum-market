import React, { Component } from 'react';
import Alert from 'react-bootstrap/Alert'
import history from '../history'
import { Switch, Route } from 'react-router-dom'
import Verification from './Verification'
import AuthService from '../services/AuthService'

class Login extends Component {
  constructor(props) {
    super(props);

    this.state = {
      email: '',
      password: '',
      showAlert: false,
      signupBool: false,
      name: '',
      address: '',
      mobile: '',
      showVerify: false,
      alreadyUsedAlert: false
    };

    this.signup = this.signup.bind(this);
    this.togglePage = this.togglePage.bind(this);
    this.login = this.login.bind(this);
    this.handleChange = this.handleChange.bind(this);
  }

  componentDidMount() {
    history.push('/')
  }

  handleChange(e) {
    this.setState({ [e.target.name]: e.target.value });
  }

  login(e) {
    e.preventDefault();
    AuthService.login(this.state.email, this.state.password).then((data) => {
      let u = data.us;
      if (!u.emailVerified) {
        this.setState({
          showVerify: true,
          showAlert: false,
          password: ''
        })
      }
      else {
        this.props.verify()
      }
    })
      .catch((error) => {
        this.setState({
          showAlert: true,
          showVerify: false,
          password: ''
        })
      });
  }

  togglePage() {
    this.setState({ email: "", password: "" })
    this.setState({ signupBool: !this.state.signupBool })
  }

  signup(e) {
    e.preventDefault();
    const newUser = {
      address: this.state.address,
      telephone: this.state.mobile,
      isPremium: false,
      email: this.state.email + '@mytum.de',
      name: this.state.name
    };

    AuthService.signup(this.state.email, this.state.password, newUser).then((msg) => {
      history.push('/verify')
    })
      .catch((er) => {
        this.setState({ alreadyUsedAlert: true })
      })
  }

  render() {
    if (!this.state.signupBool) {
      return (
        <div className="container mt-5">
          <div className="mx-auto my-auto p-4 w-50 login-border">
            <h3 className="login-header">Student Login</h3>
            <hr></hr>
            <form onSubmit={e => this.login(e)}>
              <div className="form-group text-sub-title" >
                <label >Email</label>
                <input required value={this.state.email} onChange={this.handleChange} type="email" name="email" className="form-control" aria-describedby="emailHelp" placeholder="Enter email address" />
              </div>
              <div className="form-group text-sub-title">
                <label htmlFor="exampleInputPassword1">Password</label>
                <input required value={this.state.password} onChange={this.handleChange} type="password" name="password" className="form-control" placeholder="Enter password" />
              </div>
              <Alert show={this.state.showAlert} variant={"danger"} >
                Wrong password or email, please try again.
            </Alert>
              <Alert show={this.state.showVerify} variant={"warning"} >
                Email not verified, please check your inbox.
            </Alert>
              <div className="d-flex">
                <div>
                  <button type="submit" className="btn btn-primary">Login</button>
                </div>
                <div className="ml-auto mt-auto mb-auto large-text">
                  <span>New here? <strong style={{ cursor: "pointer" }} onClick={this.togglePage} className="text-premium bold">Sign Up!</strong></span>
                </div>
              </div>
            </form>
          </div>
        </div>
      );
    }
    else {
      return (
        <Switch>
          <Route path="/verify" component={Verification} />
          <React.Fragment>
            <div className="container mb-3 mt-3">
              <div className="mx-auto my-auto p-4 w-50 login-border">
                <h3 className="login-header">Create New Account</h3>
                <hr></hr>
                <label className="text-sub-title">Email</label>
                <form onSubmit={e => this.signup(e)}>
                  <div className="d-flex">
                    <div className="form-group mb-2">
                      <input required name="email" pattern="[a-zA-Z0-9._%+-]{1,40}" title="Please enter only the first part of your TUM mail." onChange={this.handleChange} type="text" className="form-control w-100" placeholder="TUM Email" />
                    </div>
                    <div className="form-group mx-sm-3 mb-2">
                      <div className="input-group-prepend">
                        <div className="input-group-text">@mytum.du</div>
                      </div>
                    </div>
                  </div>
                  <label className="text-sub-title">Password</label>
                  <div className="form-group mb-2">
                    <input required name="password" onChange={this.handleChange} type="password" className="form-control w-75" placeholder="Password" minLength="8" maxLength="20" />
                  </div>
                  <label className="text-sub-title">Full Name</label>
                  <div className="form-group mb-2">
                    <input required pattern="[a-zA-ZäöüÄÖÜß\s]{1,40}" title="Name can only have alphabetic characters. (max 40 char.)" maxLength="40" name="name" onChange={this.handleChange} type="text" className="form-control w-75" placeholder="Name + Last Name" />
                  </div>
                  <label className="text-sub-title">Mobile Number</label>
                  <div className="form-group mb-2">
                    <input pattern="[0-9+\s]{10,20}" title="Mobile number can only have +, space, and numeric characters. (min 10, max 20 char.)" required name="mobile" onChange={this.handleChange} type="tel" className="form-control w-75" placeholder="Mobile" maxLength="20" />
                  </div>
                  <label className="text-sub-title">Address <span style={{ color: "#707070", fontSize: "14px" }}>(max 100 characters)</span></label>
                  <div className="form-group mb-2">
                    <input required name="address" onChange={this.handleChange} type="text" className="form-control" placeholder="Address" maxLength="100" />
                  </div>
                  <Alert show={this.state.alreadyUsedAlert} variant={"danger"} >
                    Email already in use.
                  </Alert>
                  <div className="d-flex mt-3">
                    <div>
                      <button type="submit" className="btn btn-primary">
                        Sign Up
                    </button>
                    </div>
                    <div className="ml-auto mt-auto mb-auto large-login large-text">
                      <span>Already have an account? <strong style={{ cursor: "pointer" }} onClick={this.togglePage} className="text-premium bold">Login!</strong></span>
                    </div>
                  </div>
                </form>
              </div>
            </div>
          </React.Fragment>
        </Switch>
      );
    }
  }
}
export default Login;        
