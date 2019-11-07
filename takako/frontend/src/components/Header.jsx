import React, { Component } from 'react';
import {connect} from 'react-redux';
import {auth} from "../actions";

class Header extends Component {
render() {
    return (
  <div>
    <header class="header">
      <div class="topbar-contents">
        <a href="/" class="logo-link"><img class="logo" src={require('../img/Torimo_new.png')} /></a>
        { !this.props.user && (
          <div class="login">
            <a class="register" href="/register">Get Started</a>
            <a class="signin" href="/login">Sign in</a>
          </div>
        )}
      </div>

      <div class="mobile-topbar-contents">

        <a href="#"><img class="logo-mobile" src={require('../img/Torimo_new.png')} /></a>
        <a href="/login" class="mobile-signin">
          <img class="mobile-menu-icon" src={require('../img/signin.png')} />
          <p class="sign-in-mobile">Sign in</p>
        </a>

      </div>

      <div class="menu">
        <a href="/search">Request Item</a>
        <a href="/how-it-works">How it works</a>
      </div>
    </header>
  </div>
  )}
}

const mapStateToProps = state => {
  return {
    user: state.auth.user,
  }
}

const mapDispatchToProps = dispatch => {
  return {
    logout: () => dispatch(auth.logout()),
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Header);
