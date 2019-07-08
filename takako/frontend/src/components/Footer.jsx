import React, { Component } from 'react';
import {connect} from 'react-redux';
import {auth} from "../actions";

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

class Footer extends Component {
render() {
    return (
      <footer>
        FOOTER CONTENTS TO BE DETERMINED
        <FontAwesomeIcon icon="igloo" />
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
