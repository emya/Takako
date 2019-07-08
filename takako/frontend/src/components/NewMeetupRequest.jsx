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
import Footer from './Footer'

class NewMeetupRequest extends Component {
  render() {
    return (
   <div>
      <Header />

      <div class="wrapper clearfix">
        <SideMenu />
        <form class="form">
          <h2>Accept Meetup Request</h2>
          <div class="meetup-rule">Meetup/Delivery will take place between 1/1/2019 - 1/30/2019</div>
          <div class="form-wrapper">

            <div class="form-section">
              <p class="form-heading">Traveler</p><br/>
              <p class="form-data">xx</p><br />
              <p class="form-heading">Traveler Contant Info</p><br/>
              <p class="form-data">123-456-7890</p><br />
              <p class="form-heading">Item Name</p><br/>
              <p class="form-data">xx</p><br />
            </div>

            <div class="form-section">
              <p class="form-heading">Your Preferred Contact</p><br />
              <input class="contact-option" placeholder="Phone Number"/><input class="contact-option" placeholder="e-mail"/>
            </div>

            <div class="form-section">
              <p class="form-heading">Meetup Option 1</p><br />
              <p class="form-data meetup">1/1/2020</p><p class="form-data meetup">10:00AM</p><p class="form-data meetup">Hilton NY</p><p class="form-data meetup">Lobby</p>
              <button class="btn accept">Accept</button><br />
              <p class="form-heading">Meetup Option 2</p><br />
              <p class="form-data meetup">1/1/2020</p><p class="form-data meetup">10:00AM</p><p class="form-data meetup">Hilton NY</p><p class="form-data meetup">Lobby</p>
              <button class="btn accept">Accept</button><br />
              <p class="form-heading">Meetup Option 3</p><br />
              <p class="form-data meetup">1/1/2020</p><p class="form-data meetup">10:00AM</p><p class="form-data meetup">Hilton NY</p><p class="form-data meetup">Lobby</p>
              <button class="btn accept">Accept</button><br />
            </div>
          </div>

          <button class="form-send-btn btn" onClick={this.proceedRequest}>Request New Meetup Date/Place</button>

        </form>
      </div>

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

      <Footer />
    </div>
    )
  }
}


export default NewMeetupRequest;
