import React, { Component } from 'react';
import '../css/style.scss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import SearchBar from './SearchBar'
import SearchResults from './SearchResults'

import {connect} from 'react-redux';

import Header from './Header'
import SideMenu from './SideMenu'

class Search extends Component {
  state = {
    residence: "",
    destination: "",
    profiles: []
  }

  handleFormSubmit = (residence, destination) => {
    let headers = {"Content-Type": "application/json"};
    let {token} = this.props.auth;

    if (token) {
      headers["Authorization"] = `Token ${token}`;
    }

    fetch(`/api/travelers/profiles/?others=True&destination=${destination}`, {headers, })
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
      <Header />

      <div class="wrapper clearfix">
        <SideMenu />

        <SearchBar handleFormSubmit={this.handleFormSubmit}/>
        <SearchResults travelers={this.state.profiles}/>
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


