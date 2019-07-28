import React, { Component } from 'react';
import MediaQuery from 'react-responsive';
import '../css/style.scss';
import { library } from '@fortawesome/fontawesome-svg-core'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faIgloo } from '@fortawesome/free-solid-svg-icons'

import {createStore} from 'redux';
import {Provider, connect} from 'react-redux';

import Header from './Header';
import SideMenu from './SideMenu';
import MobileSideMenu from './MobileSideMenu';
import Footer from './Footer';

class NewMeetupRequest extends Component {
  render() {
    console.log(this.props.location.state.meetup);
    let meetup;
    if (this.props.location.state.meetup) {
      meetup = this.props.location.state.meetup;
    } else {
      return null
    }

    return (
   <div>
      <Header />

      <div class="wrapper clearfix">
        <SideMenu />
        <form class="form">
          <h2>Accept Meetup Request</h2>
          <div class="form-wrapper">

            <div class="form-section">
              <p class="form-heading">Meetup Option you accepted</p><br />
              <p class="form-data meetup">{meetup.date}</p>
              <p class="form-data meetup">{meetup.dtime}</p>
              <p class="form-data meetup">{meetup.address}</p>
              <p class="form-data meetup">{meetup.comment}</p>
            </div>

            <div class="form-section">
              <p class="form-heading">Your Preferred Contact</p><br />
              <input class="contact-option" placeholder="Phone Number"/><input class="contact-option" placeholder="e-mail"/>
            </div>
          </div>

          <button class="form-send-btn btn">Share your contact</button>

        </form>
      </div>
      <MobileSideMenu />
      <Footer />
    </div>
    )
  }
}


export default NewMeetupRequest;
