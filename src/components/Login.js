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
    this.togglepage = this.togglepage.bind(this);
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

  togglepage(){
    this.setState({singupBool: !this.state.singupBool})
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
    if (!this.state.singupBool){
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
          <h7>New here? </h7><strong onClick={this.togglepage}><a href="#" data-toggle="tooltip" data-placement="top" title="Create account!">Singup</a></strong>
        </div>
      </div>
    );
    }
    else{
    return (
      <div className="container mt-5">
        <div className="mx-auto my-auto p-4 w-50 login-border">
          <h3 className="login-header">Create new account</h3>
          <hr></hr>
          <label htmlFor="exampleInputEmail1">Email</label>
          <form class="form-inline">
            <div class="form-group mb-2">
              <input type="text" class="form-control"  placeholder="Eamil"/>
            </div>
            <div class="form-group mx-sm-3 mb-2">
              <div class="input-group-prepend">
                <div class="input-group-text">@mytum.du</div>
              </div>            
            </div>
          </form>
          <label htmlFor="exampleInputEmail1">Password</label>
            <div class="form-group mb-2">
              <input type="text" class="form-control"  placeholder="Password"/>
            </div>
          <label htmlFor="exampleInputEmail1">Extra Inforamtion</label>
          <div class="form-group mb-2">
              <input type="text" class="form-control"  placeholder="Name"/>
            </div>
          <form class="form-inline">
            <div class="form-group mb-2">
              <input type="text" class="form-control"  placeholder="Address"/>
            </div>
            <div class="form-group mx-sm-3 mb-2">
              <input type="text" readonly class="form-control" placeholder="Mobile" />
            </div>
          </form>
          <button type="submit" onClick={this.signup} className="btn btn-primary">Signup</button> 
        <div>
        <h7>you have an account? </h7><strong onClick={this.togglepage}><a href="#" data-toggle="tooltip" data-placement="top" title="Create account!">Login</a></strong>

        </div>
          </div>  
        </div>
        );
    }
  }
}
export default Login;