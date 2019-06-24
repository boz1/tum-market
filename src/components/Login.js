import React, { Component } from 'react';
import firebase from '../config/firebaseConfig';
import Alert from 'react-bootstrap/Alert'

class Login extends Component {
  constructor(props) {
    super(props);

    this.state = {
      email: '',
      password: '',
      showAlert: false,
      singupBool:false

    };
    this.signup = this.signup.bind(this);
    this.singupPage = this.singupPage.bind(this);
    this.login = this.login.bind(this);
    this.handleChange = this.handleChange.bind(this);
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

  singupPage(){
    this.setState({singupBool: true})
  }

  signup(e){
    e.preventDefault();
    firebase.auth().createUserWithEmailAndPassword(this.state.email, this.state.password).then((u)=>{
    }).then((u)=>{console.log(u)})
    .catch((error) => {
        console.log(error);
      })
  }
  render() {
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
            {this.state.showAlert ?  <Alert variant={"danger"} >
              Wrong password or email, please try again.
            </Alert> : ''}
            <button type="submit" onClick={this.login} className="btn btn-primary">Login</button> 
          </form>
          <h7>New here? </h7><strong onClick={this.singupPage}><a href="#" data-toggle="tooltip" data-placement="top" title="Create account!">Singup</a></strong>
        </div>
      </div>
    );
    }

  }
}
export default Login;