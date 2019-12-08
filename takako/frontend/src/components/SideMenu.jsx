import React, { Component } from 'react';
import {connect} from 'react-redux';
import {auth} from "../actions";

class SideMenu extends Component {
render() {
    return (
      <div class="sidemenu">
        <ul>
          <li><a href={'/search'}>Find Traveler</a></li>
          <li><a href={'/transaction/status'}>My Transactions</a></li>
          <li><a href={'/trips'}>See Trips</a></li>
          <li><a href={'/how-it-works'}>How It Works</a></li>
          <li><a href={'/contact-us'}>Contact Us</a></li>
          <li><a class="logout" onClick={this.props.logout}>Logout</a></li>
        </ul>
      </div>
  )}
}

const mapStateToProps = state => {
  return {
    profile: state.profile,
    user: state.auth.user,
  }
}

const mapDispatchToProps = dispatch => {
  return {
    logout: () => dispatch(auth.logout()),
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(SideMenu);
