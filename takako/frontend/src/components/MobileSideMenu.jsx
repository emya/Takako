import React, { Component } from 'react';
import {connect} from 'react-redux';
import {auth} from "../actions";

class MobileSideMenu extends Component {
render() {
    return (
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
