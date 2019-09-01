import React, {Component} from "react";
import {connect} from "react-redux";

import {Link, Redirect} from "react-router-dom";

import {auth} from "../actions";

class Login extends Component {

  state = {
    first_name: "",
    last_name: "",
    email: "",
    password: "",
  }

  onSubmit = e => {
    e.preventDefault();
    this.props.register(this.state.first_name, this.state.last_name, this.state.email, this.state.password);
  }

  render() {
    if (this.props.isAuthenticated) {
      return <Redirect to='/myprofile' />
    }
    return (
      <form onSubmit={this.onSubmit}>
        <fieldset class="signin-box">
          <legend>Register</legend>
          {this.props.errors.length > 0 && (
            <div>
              {this.props.errors.map(error => (
                <p class="start-error" key={error.field}>{error.message}</p>
              ))}
            </div>
          )}
          <p>
            <label class="start" htmlFor="first_name">First Name</label>
            <input
              type="text" id="first_name"
              onChange={e => this.setState({first_name: e.target.value})} required/>
          </p>
          <p>
            <label class="start" htmlFor="first_name">Last Name</label>
            <input
              type="text" id="last_name"
              onChange={e => this.setState({last_name: e.target.value})} required/>
          </p>
          <p>
            <label class="start" htmlFor="email">Email</label>
            <input
              type="email" id="email"
              onChange={e => this.setState({email: e.target.value})} required/>
          </p>
          <p>
            <label class="start" htmlFor="password">Password</label>
            <input
              type="password" id="password"
              onChange={e => this.setState({password: e.target.value})} required/>
          </p>
          <p>
            <button class="btn start-page" type="submit">Register</button>
          </p>

          <p>
            Already have an account? <a class="start-link" href="/login" style={{color: "black"}}>Login</a>
          </p>
        </fieldset>
      </form>
    )
  }
}

const mapStateToProps = state => {
  let errors = [];
  if (state.auth.errors) {
    errors = Object.keys(state.auth.errors).map(field => {
      return {field, message: state.auth.errors[field]};
    });
  }
  return {
    errors,
    isAuthenticated: state.auth.isAuthenticated,
    user: state.auth.user
  };
}

const mapDispatchToProps = dispatch => {
  return {
    register: (first_name, last_name, email, password) => dispatch(auth.register(first_name, last_name, email, password)),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(Login);
