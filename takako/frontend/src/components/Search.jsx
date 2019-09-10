import React, { Component } from 'react';
import '../css/style.scss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import SearchBar from './SearchBar'
import SearchResults from './SearchResults'

import {connect} from 'react-redux';

import Header from './Header'
import SideMenu from './SideMenu'
import Footer from './Footer'
import MobileSideMenu from './MobileSideMenu'

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
    <div class="search">
      <div class="wrapper clearfix">
        <SideMenu />

        <SearchBar handleFormSubmit={this.handleFormSubmit}/>
        <SearchResults travelers={this.state.profiles}/>
      </div>
    </div>

  <MobileSideMenu />

  <Footer />
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
