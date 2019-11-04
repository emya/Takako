import React, {Component} from "react";
import {connect} from "react-redux";
import {Link, Redirect} from "react-router-dom";

import queryString from 'query-string';

import {auth} from "../actions";

class Login extends Component {
  state = {
    email: "",
    password: "",
  }

  onSubmit = e => {
    e.preventDefault();
    this.props.login(this.state.email, this.state.password);
  }

  render() {
    if (this.props.isAuthenticated) {
      if (this.props.location && this.props.location.search) {
        let params = queryString.parse(this.props.location.search);
        let next = params.next;
        return <Redirect to={next} />
      }
      return <Redirect to='/myprofile' />
    }
    return (
      <form onSubmit={this.onSubmit}>
        <fieldset class="signin-box">
          <legend>Login</legend>
          {this.props.errors.length > 0 && (
            <div>
              {this.props.errors.map(error => (
                <p class="start-error" key={error.field}>{error.message}</p>
              ))}
            </div>
          )}
          <p>
            <label class="start" htmlFor="email">Email</label>
            <input
              type="email" id="email"
              onChange={e => this.setState({email: e.target.value})} />
          </p>
          <p>
            <label class="start" htmlFor="password">Password</label>
            <input
              type="password" id="password"
              onChange={e => this.setState({password: e.target.value})} />
          </p>
          <p>
            <button class="btn start-page" type="submit">Login</button>
          </p>

          <p>
            <a class="start-link" href="/reset/password" style={{color: "black"}}> Forgot Password? </a>
          </p>

          <p>
            Don't have an account? <a class="start-link" href="/register" style={{color: "black"}}>Register</a>
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
        login: (email, password) => {
            return dispatch(auth.login(email, password));
        }
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(Login);
