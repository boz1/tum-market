import React, { Component } from 'react';
import firebase from '../config/firebaseConfig';
import Alert from 'react-bootstrap/Alert'
import history from '../history'


class Login extends Component {
  constructor(props) {
    super(props);

    this.state = {
      email: '',
      password: '',
      showAlert: false,
      singupBool:false,
      name:'',
      address:'',
      mobile:''

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
    firebase.auth().signInWithEmailAndPassword(this.state.email, this.state.password).then((u) => {
    }).catch((error) => {
      this.setState({
        showAlert: true,
        password: ''
      })
    });
  }

  togglePage() {
    this.setState({ singupBool: !this.state.singupBool })
  }

  signup(e) {
    e.preventDefault();
    firebase.auth().createUserWithEmailAndPassword(this.state.email, this.state.password).then((u) => {
    }).then((u) => { console.log(u) })
      .catch((error) => {
        console.log(error);
      })
  }

  render() {
    if (!this.state.singupBool) {
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
        <div className="container mt-5">
          <div className="mx-auto my-auto p-4 w-50 login-border">
            <h3 className="login-header">Create New Account</h3>
            <hr></hr>
            <label htmlFor="exampleInputEmail1" className="large-text">Email</label>
            <form className="form-inline">
              <div className="form-group mb-2">
                <input type="text" className="form-control" placeholder="TUM Email" />
              </div>
              <div className="form-group mx-sm-3 mb-2">
                <div className="input-group-prepend">
                  <div className="input-group-text">@mytum.du</div>
                </div>
              </div>
            </form>
            <label htmlFor="exampleInputEmail1" className="large-text">Password</label>
            <div className="form-group mb-2">
              <input type="text" className="form-control" placeholder="Password" />
            </div>
            <label htmlFor="exampleInputEmail1" className="large-text">Details</label>
            <div className="form-group mb-2">
              <input type="text" className="form-control" placeholder="Name" />
            </div>
            <form className="form-inline">
              <div className="form-group mb-2">
                <input type="text" className="form-control" placeholder="Address" />
              </div>
              <div className="form-group mx-sm-3 mb-2">
                <input type="text" readOnly className="form-control" placeholder="Mobile" />
              </div>
            </form>
            <div className="d-flex mt-2">
              <div>
                <button type="submit" onClick={this.signup} className="btn btn-primary">Sign Up</button>
              </div>
              <div className="ml-auto mt-auto mb-auto  large-text">
                <span>Already have an account? <strong style={{cursor:"pointer"}} onClick={this.togglePage} className="text-premium bold">Login!</strong></span>
              </div>
            </div>
          </div>
        </div>
      );
    }
  }
}
export default Login;