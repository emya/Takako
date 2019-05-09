import React, { Component } from 'react';
import {connect} from 'react-redux';
import {auth} from "../actions";

class SideMenu extends Component {
render() {
    console.log(this.props);
    return (
      <div class="sidemenu">
        <ul>
          <li><a href={`/profile/${this.props.user.id}`}>My Profile</a></li>
          <li><a href="/transaction/status">Transaction Status</a></li>
          <li><a href="#">Message Box</a></li>
          <li><a href="#">Edit Profile</a></li>
          <li><a href="#">Edit Account</a></li>
          <li><a onClick={this.props.logout} style={{color: "white"}}>Logout</a></li>
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

const mapDispatchToProps = dispatch => {
  return {
    logout: () => dispatch(auth.logout()),
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(SideMenu);