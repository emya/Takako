import React, { Component } from 'react';
import MediaQuery from 'react-responsive';
import '../css/style.scss';
import { library } from '@fortawesome/fontawesome-svg-core'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faIgloo } from '@fortawesome/free-solid-svg-icons'
import SearchBar from './SearchBar'
import SearchResults from './SearchResults'

import {createStore} from 'redux';
import {Provider, connect} from 'react-redux';

class Search extends Component {
  state = {
    keyword: "",
    profiles: []
  }

  handleFormSubmit = (keyword) => {
    let headers = {"Content-Type": "application/json"};
    let {token} = this.props.auth.token;

    if (token) {
      headers["Authorization"] = `Token ${token}`;
    }
    fetch("/api/profiles/?all=True", {headers, })
      .then(res => {
        if (res.status < 500) {
          return res.json().then(data => {
            return {status: res.status, data};
          })
        } else {
          console.log("Server Error!");
          throw res;
        }
      })
      .then(res => {
        if (res.status === 200) {
          console.log("res.data", res.data);
          //this.props.searchResults(res.data);
          this.setState({
            profiles: res.data
          })
        } else if (res.status === 401 || res.status === 403) {
          throw res.data;
        }
      })
  }

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

        <SearchBar handleFormSubmit={this.handleFormSubmit}/>
        <SearchResults profiles={this.state.profiles}/>
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

const mapStateToProps = state => {
  return {
    auth: state.auth,
  }
}

export default connect(mapStateToProps, null)(Search);


