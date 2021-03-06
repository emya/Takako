import React, { Component } from 'react';
import '../css/style.scss';
import { library } from '@fortawesome/fontawesome-svg-core';
import { faIgloo } from '@fortawesome/free-solid-svg-icons';
import {connect} from 'react-redux';
import Header from './Header';
import SideMenu from './SideMenu';
import MobileSideMenu from './MobileSideMenu';
import Footer from './Footer';

import { keys } from '../keys.js';


class ConnectStripe extends Component {

  render() {
    return (
  <div>
   <Header />

   <div class="wrapper clearfix">
     <SideMenu />
     <div class="main">
       <h3>Hooray! You completed the request!</h3>
       <p>
         Please connect your stripe account to get paid
       </p>
       <a href={
         `https://connect.stripe.com/oauth/authorize` +
         `?response_type=code&client_id=${keys.STRIPE_CLIENT_ID}&scope=read_write&redirect_uri=${keys.STRIPE_REDIRECT_URI}&state=${this.props.match.params.requestId}`
       }>
        <button class="btn">Connect with Stripe</button>
       </a>
     </div>
   </div>
   <MobileSideMenu />
   <Footer />
</div>

    )
  }
}

const mapStateToProps = state => {
  return {
  }
}

export default connect(mapStateToProps, null)(ConnectStripe);
