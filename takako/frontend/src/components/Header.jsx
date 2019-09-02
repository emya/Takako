import React, { Component } from 'react';
import {connect} from 'react-redux';
import {auth} from "../actions";

class Header extends Component {
render() {
    return (
<div>
    <header class="header">
      <div class="topbar-contents">
        <a href="/"><img class="logo" src={require('../img/torimo-logo.png')} /></a>
        <div class="login">
          <a class="register" href="/register">Get Started</a>
          <a class="signin" href="/login">Sign in</a>
        </div>
      </div>

        <div class="mobile-topbar-contents">
          <a href="#" class="mobile-menu-icon"><i class="fa fa-bars">三</i></a>
          <a href="#"><p>APP<br/>LOGO</p></a>
          <a href="#" class="mobile-menu-icon"><i class="fa fa-bars">★</i></a>
        </div>

      <div class="menu">
        <a href="/search">Request Item</a>
        <a href="/how-it-works">How it works</a>
      </div>
    </header>
</div>
  )}
}

const mapDispatchToProps = dispatch => {
  return {
    logout: () => dispatch(auth.logout()),
  }
}

export default connect(null, mapDispatchToProps)(Header);
