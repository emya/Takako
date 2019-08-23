import React, { Component } from 'react';
import {connect} from 'react-redux';
import {auth} from "../actions";

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

class Footer extends Component {
render() {
    return (
      <footer>
      <div class="footer-item">
        <ul>
          <li>About Us</li>
          <li>Terms of Services</li>
          <li>Privacy Policy</li>
        </ul>
      </div>
      <div class="footer-item">
        <ul>
          <li>How It Works</li>
          <li>FAQ</li>
          <li>Contact Us</li>
        </ul>
      </div>
      </footer>
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

export default connect(mapStateToProps, mapDispatchToProps)(Footer);
