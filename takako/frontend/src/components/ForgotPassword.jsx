import React, {Component} from "react";
import {connect} from "react-redux";

import {Link, Redirect} from "react-router-dom";

import {auth} from "../actions";

class ForgotPassword extends Component {
  state = {
    isForgotEmailSent: false,
    email: "",
  }

  componentWillReceiveProps(newProps){
    if(newProps.isForgotEmailSent !== this.props.isForgotEmailSent){
      this.setState({isForgotEmailSent: newProps.isForgotEmailSent })
    }
  }

  onSubmit = e => {
    e.preventDefault();
    this.props.forgotPassword(this.state.email);
  }

  render() {
    if (this.state.isForgotEmailSent) {
      return (
        <p> We sent you an email to reset your password!</p>
      )
    }
    return (
      <form onSubmit={this.onSubmit}>
        <fieldset class="signin-box">
          <legend>Forgot Password?</legend>
          <p>
            <label class="start" htmlFor="email">Email</label>
            <input
              type="email" id="email"
              onChange={e => this.setState({email: e.target.value})} />
          </p>
          <p>
            <button class="btn start-page" type="submit">Send email</button>
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
    isForgotEmailSent: state.auth.isForgotEmailSent,
    user: state.auth.user
  };
}

const mapDispatchToProps = dispatch => {
  return {
    forgotPassword: (email) => {
      return dispatch(auth.forgotPassword(email));
    }
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(ForgotPassword);
