import React, { Component } from 'react';
import {connect} from 'react-redux';
import {auth} from "../actions";

class MobileSideMenu extends Component {
render() {
    return (
      <div class="sidemenu-mobile">
        <ul>
        <li><a href={'/search'}>Find Traveler</a><span>></span></li>
        <li><a href={'/trips'}>Browse Trips</a><span>></span></li>
        <li><a href={'/myprofile'}>My Profile</a><span>></span></li>
        <li><a href={'/transaction/status'}>My Transactions</a><span>></span></li>
        <li><a href={'/how-it-works'}>How It Works</a><span>></span></li>
        <li><a href={'/contact-us'}>Contact Us</a><span>></span></li>
        <li><a onClick={this.props.logout}>Logout<span>></span></a></li>
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

export default connect(mapStateToProps, mapDispatchToProps)(MobileSideMenu);
