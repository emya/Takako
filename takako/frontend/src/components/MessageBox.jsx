import React, { Component } from 'react';
import '../css/style.scss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { AddMessage } from '../containers/AddMessage'
import { MessagesList } from '../containers/MessagesList'

class MessageBox extends Component {
  render() {
    return (
   <div>
      <header class="header">
          <div class="topbar-contents">
            <form class="search">
              <input type="search" name="search" placeholder="Search"/>
              <input class="search-button" type="submit" value="Search"/>
            </form>
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
          <a href="#">HOME</a>
          <a href="#">Request Item</a>
          <a href="#">Find Request</a>
          <a href="#">Mypage</a>
        </div>
      </header>

      <div class="wrapper clearfix">
        <div class="sidemenu">
          <ul>
            <li><a href="#">My Profile</a></li>
            <li><a href="#">Transaction Status</a></li>
            <li><a href="#">Message Box</a></li>
            <li><a href="#">Edit Profile</a></li>
            <li><a href="#">Edit Account</a></li>
            <li><a href="#">Logout</a></li>
            <li><a href="#">Help</a></li>
          </ul>
        </div>

        <div class="msg-box">
          <h2>Message Box</h2>
          <div class="wrapper clearfix">
            <div class="msg-history">
              <form class="search">
                <input type="search" name="search" placeholder="Search Message"/>
              </form>
              <div class="msg-history-item">
                <img class="msg-history-img" src=""/>
                <div class="msg-history-contents">
                  <p class="msg-name">Emi 3/2/2019</p>
                  <p class="msg-subject">Japanese Snack</p>
                </div>
              </div>
              <div class="msg-history-item">
                <img class="msg-history-img" src=""/>
                <div class="msg-history-contents">
                  <p class="msg-name">Takumi 2/28/2019</p>
                  <p class="msg-subject">About wine</p>
                </div>
              </div>
            </div>
            <div class="chat">
              <MessagesList />
              <AddMessage />
            </div>
          </div>

        </div>
      </div>

      <div class="sidemenu-mobile">
      <ul>
      <li><a href="#">My Profile<span>></span></a></li>
      <li><a href="#">Transaction Status<span>></span></a></li>
      <li><a href="#">Message Box<span>></span></a></li>
      <li><a href="#">Edit Profile<span>></span></a></li>
      <li><a href="#">Edit Account<span>></span></a></li>
      <li><a href="#">Logout<span>></span></a></li>
      <li><a href="#">Help<span>></span></a></li>
      </ul>
      </div>

    <footer>
    FOOTER CONTENTS TO BE DETERMINED
    <FontAwesomeIcon icon="igloo" />
    </footer>
  </div>
    )
  }
}

export default MessageBox;


