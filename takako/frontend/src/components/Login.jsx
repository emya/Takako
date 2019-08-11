import React, {Component} from "react";
import {connect} from "react-redux";

import {Link, Redirect} from "react-router-dom";

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
      console.log("isAuthenticated", this.props)
      return <Redirect to='/myprofile' />
    }
    return (
      <form onSubmit={this.onSubmit}>
        <fieldset>
          <legend>Login</legend>
          {this.props.errors.length > 0 && (
            <ul>
              {this.props.errors.map(error => (
                <li key={error.field}>{error.message}</li>
              ))}
            </ul>
          )}
          <p>
            <label htmlFor="email">Email</label>
            <input
              type="email" id="email"
              onChange={e => this.setState({email: e.target.value})} />
          </p>
          <p>
            <label htmlFor="password">Password</label>
            <input
              type="password" id="password"
              onChange={e => this.setState({password: e.target.value})} />
          </p>
          <p>
            <button type="submit">Login</button>
          </p>

          <p>
            <Link to="/reset/password" style={{color: "black"}}> Forgot Password? </Link>
          </p>

          <p>
            Don't have an account? <Link to="/register" style={{color: "black"}}>Register</Link>
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
