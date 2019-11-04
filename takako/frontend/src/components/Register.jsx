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
    isAgreed: false,
    errors: [],
  }

  handleAgreementCheck = (e) => {
    console.log("handleAgreementCheck");
    this.setState({
      isAgreed: e.target.checked
    })
  }

  validateForm = (isAgreed) => {
    // we are going to store errors for all fields
    // in a signle array
    const errors = [];

    console.log(isAgreed)
    if (!isAgreed) {
      errors.push("Please read and agree to the Terms");
    }
    return errors;
  }

  onSubmit = e => {
    e.preventDefault();
    const errors = this.validateForm(this.state.isAgreed);

    this.setState({ errors });

    if (errors.length > 0) {
      return;
    }

    this.props.register(this.state.first_name, this.state.last_name, this.state.email, this.state.password);
  }

  render() {
    if (this.props.isAuthenticated) {
      return <Redirect to='/myprofile' />
    }
    const errors = this.state.errors;

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
          {errors.map(error => (
             <p class="error-heading" key={error}>Error: {error}</p>
          ))}
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
          <input type="checkbox" id="terms" checked={this.state.isAgreed} onChange={this.handleAgreementCheck} />
          <p class="agree">I have read and agree to <a href="/terms-conditions" class="start-link">the Terms</a></p>
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
