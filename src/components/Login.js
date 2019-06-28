import React, { Component } from 'react';
import firebase from '../config/firebaseConfig';
import Alert from 'react-bootstrap/Alert'
import history from '../history'
import { Link } from 'react-router-dom'
import { Switch, Route } from 'react-router-dom'
import Verification from './Verification'

class Login extends Component {
  constructor(props) {
    super(props);

    this.state = {
      email: '',
      password: '',
      showAlert: false,
      signupBool:false,
      name:'',
      address:'',
      mobile:'',
      error:{}
    };

    this.signup = this.signup.bind(this);
    this.togglePage = this.togglePage.bind(this);
    this.login = this.login.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.validateForm = this.validateForm.bind(this);
  }

  componentDidMount() {
    history.push('/')
  }

  handleChange(e) {
    this.setState({ [e.target.name]: e.target.value });
  }

  login(e) {
    e.preventDefault();
    firebase.auth().signInWithEmailAndPassword(this.state.email, this.state.password)
    .then((u) => {console.log(u)})
    .catch((error) => {
      console.log(error)
      this.setState({
        showAlert: true,
        password: ''
      })
    });
  }

  togglePage() {
    this.setState({email:"",password:""})
    this.setState({ signupBool: !this.state.signupBool })
  }

  validateForm() {

    let errors = {};
    let formIsValid = true;

    if (!this.state.name) {
      formIsValid = false;
      errors["name"] = "*Please enter your username.";
    }

    if (typeof this.state.name !== "undefined") {
      if (!this.state.name.match(/^[a-zA-Z ]*$/)) {
        formIsValid = false;
        errors["name"] = "*Please enter alphabet characters only.";
      }
    }

    if (!this.state.email) {
      formIsValid = false;
      errors["email"] = "*Please enter your email-ID.";
    }

    if (typeof this.state.email !== "undefined") {
      //regular expression for email validation
      var pattern = new RegExp(/^(("[\w-\s]+")|([\w-]+(?:\.[\w-]+)*)|("[\w-\s]+")([\w-]+(?:\.[\w-]+)*))/i);
      if (!pattern.test(this.state.email)) {
        formIsValid = false;
        errors["email"] = "*Please enter valid email-ID.";
      }
    }

    if (!this.state.mobile) {
      formIsValid = false;
      errors["mobile"] = "*Please enter your mobile no.";
    }

    if (typeof this.state.mobile !== "undefined") {
      if (!this.state.mobile.match(/^[0-9]{10}$/)) {
        formIsValid = false;
        errors["mobile"] = "*Please enter valid Number.";
      }
    }

    if (!this.state.password) {
      formIsValid = false;
      errors["password"] = "*Please enter your password.";
    }

    if (typeof this.state.password !== "undefined") {
      if (!this.state.password.match(/^.*(?=.{8,})(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[@#$%&]).*$/)) {
        formIsValid = false;
        errors["password"] = "*Please enter secure and strong password.";
      }
    }
    if (!this.state.address) {
      formIsValid = false;
      errors["address"] = "*Please enter your address.";
    }
    this.setState({
      error: errors
    });
    console.log(errors)
    return formIsValid;
  }
  signup(e) {
    if(this.validateForm()){
    e.preventDefault();
    firebase.auth().createUserWithEmailAndPassword(this.state.email+"@mytum.du", this.state.password).then((u) => {
    }).then((u) => { console.log(u) })
      .catch((error) => {
        console.log(error);
      })
    }
  }

  render() {

    if (!this.state.signupBool) {
      return (
        <div className="container mt-5">
          <div className="mx-auto my-auto p-4 w-50 login-border">
            <h3 className="login-header">Student Login</h3>
            <hr></hr>
            <form>
              <div className="form-group large-text" >
                <label htmlFor="exampleInputEmail1">Email</label>
                <input value={this.state.email} onChange={this.handleChange} type="email" name="email" className="form-control" id="exampleInputEmail1" aria-describedby="emailHelp" placeholder="Enter email address" />
                {/* <small id="emailHelp" className="form-text text-muted">We'll never share your email with anyone else.</small> */}
              </div>
              <div className="form-group large-text">
                <label htmlFor="exampleInputPassword1">Password</label>
                <input value={this.state.password} onChange={this.handleChange} type="password" name="password" className="form-control" id="exampleInputPassword1" placeholder="Enter password" />
              </div>
              {this.state.showAlert ? <Alert variant={"danger"} >
                Wrong password or email, please try again.
            </Alert> : ''}
              <div className="d-flex">
                <div>
                  <button type="submit" onClick={this.login} className="btn btn-primary">Login</button>
                </div>
                <div className="ml-auto mt-auto mb-auto  large-text">
                  <span>New here? <strong style={{cursor:"pointer"}} onClick={this.togglePage} className="text-premium bold">Sign Up!</strong></span>
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
        <Route path="/verify" render={(props) => <Verification/>} />
        <div className="container mt-5">
          <div className="mx-auto my-auto p-4 w-50 login-border">
            <h3 className="login-header">Create New Account</h3>
            <hr></hr>
            <label htmlFor="exampleInputEmail1" className="large-text">Email</label>
            <form className="form-inline">
              <div className="form-group mb-2">
                <input name="email"  onChange={this.handleChange}value={this.state.email} type="text" className="form-control" placeholder="TUM Email" />
              </div>
              <div className="form-group mx-sm-3 mb-2">
                <div className="input-group-prepend">
                  <div className="input-group-text">@mytum.du</div>
                </div>
              </div>
            </form>
            <div style={{  color: "red"}}>{this.state.error.email}</div>
            <label htmlFor="exampleInputEmail1" className="large-text">Password</label>
            <div className="form-group mb-2">
              <input name="password" onChange={this.handleChange} value={this.state.password} type="password" className="form-control" placeholder="Password" />
            </div>
            <div style={{  color: "red"}}>{this.state.error.password}</div>
            <label htmlFor="exampleInputEmail1" className="large-text">Details</label>
            <form className="form-inline">
            <div className="form-group mx-sm-3 mb-2">
              <input name="name" onChange={this.handleChange} value={this.state.name} type="text" className="form-control" placeholder="Name" />
            </div>
            <div style={{  color: "red"}}>{this.state.error.name}</div>
            </form>
            <form className="form-inline">
              <div className="form-group mx-sm-3 mb-2">
                <input name="address" onChange={this.handleChange} value={this.state.address} type="text" className="form-control" placeholder="Address" />
              </div>
              <div style={{  color: "red"}}>{this.state.error.address}</div>
              </form>
              <form className="form-inline">
              <div className="form-group mx-sm-3 mb-2">
                <input name="mobile" onChange={this.handleChange} value={this.state.mobile} type="text"  className="form-control" placeholder="Mobile" />
              </div>
              <div style={{  color: "red"}}>{this.state.error.mobile}</div>
              </form>
            <div className="d-flex mt-2">
              <div>
                <button type="submit" onClick={this.signup} className="btn btn-primary">  
                 {!this.state.error ? <Link to={{ pathname: '/verify' }} className="dropdown-item">Sign Up</Link> : "Sign Up"}
                </button>
              </div>
              <div className="ml-auto mt-auto mb-auto  large-login valdationtext">
                <span>Already have an account? <strong style={{cursor:"pointer"}} onClick={this.togglePage} className="text-premium bold">Login!</strong></span>
              </div>
            </div>
          </div>
        </div>
        </Switch>

      );
    }
  }
}
export default Login;        
