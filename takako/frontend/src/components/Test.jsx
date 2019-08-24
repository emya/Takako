import React, { Component } from 'react';
import MediaQuery from 'react-responsive';
import '../css/style.scss';
import { library } from '@fortawesome/fontawesome-svg-core'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faIgloo } from '@fortawesome/free-solid-svg-icons'

import {createStore} from 'redux';
import {Provider, connect} from 'react-redux';

import Header from './Header'
import SideMenu from './SideMenu'
import MobileSideMenu from './MobileSideMenu'
import Footer from './Footer'

class Test extends Component {
  render() {
    return (
    <div>
      <Header />

      testtesttest

      <MobileSideMenu />

      <Footer />
    </div>
    )
  }
}


export default Test;
