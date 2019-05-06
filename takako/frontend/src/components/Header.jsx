import React, { Component } from 'react';

class Header extends Component {
render() {
    return (
<div>
    <header class="header">
        <div class="topbar-contents">
          <a href="#"><p>APP<br/>LOGO</p></a>
          <div class="login">
            <a class="register" href="#">Get Started</a>
            <a class="signin" href="#">Sign in</a>
          </div>
        </div>

        <div class="mobile-topbar-contents">
          <a href="#" class="mobile-menu-icon"><i class="fa fa-bars">三</i></a>
          <a href="#"><p>APP<br/>LOGO</p></a>
          <a href="#" class="mobile-menu-icon"><i class="fa fa-bars">★</i></a>
        </div>

      <div class="menu">
        <a href="/search">Search</a>
        <a href="#">How it works</a>
      </div>
    </header>
</div>
  )}
}

export default Header;