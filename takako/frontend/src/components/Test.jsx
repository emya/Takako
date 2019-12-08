import React, { Component } from 'react';
import '../css/style.scss';

import Header from './Header'
import SideMenu from './SideMenu'
import MobileSideMenu from './MobileSideMenu'
import Footer from './Footer'

class Test extends Component {

  render() {
    return (
  <div>
    <Header />
    <div class="wrapper clearfix">
      <SideMenu />
    </div>

    <MobileSideMenu />
    <Footer />
  </div>
    )
  }
}


export default Test;
