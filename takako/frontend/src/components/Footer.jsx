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
          <li><a href="/about">About Us</a></li>
          <li><a href="/terms-conditions">Terms of Services</a></li>
          <li><a href="/privacy-policy">Privacy Policy</a></li>
        </ul>
      </div>
      <div class="footer-item">
        <ul>
          <li><a href="/how-it-works">How It Works</a></li>
          <li><a href="/contact-us">Contact Us</a></li>
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
