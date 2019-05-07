import React, { Component } from 'react';
import {connect} from 'react-redux';

class SideMenu extends Component {
render() {
    return (
      <div class="sidemenu">
        <ul>
          <li><a href={`/profile/${this.props.user}`}>My Profile</a></li>
          <li><a href="#">Transaction Status</a></li>
          <li><a href="#">Message Box</a></li>
          <li><a href="#">Edit Profile</a></li>
          <li><a href="#">Edit Account</a></li>
          <li><a href="#">Logout</a></li>
          <li><a href="#">Help</a></li>
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

export default connect(mapStateToProps)(SideMenu);