import React, { Component } from 'react';
import {connect} from 'react-redux';
import {profile, auth} from "../actions";
import {Link, Redirect} from "react-router-dom";
import MediaQuery from 'react-responsive';
import '../css/style.scss';
import { library } from '@fortawesome/fontawesome-svg-core'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faIgloo } from '@fortawesome/free-solid-svg-icons'
import Header from './Header'
import SideMenu from './SideMenu'

library.add(faIgloo)

class RequestForm extends Component {

  render() {
    return (
  <div>
    <Header />

    <div class="wrapper clearfix">
      <SideMenu />

      <div class="request-form">
        <h2>Item Request</h2>
        <p class="request-form-index">My Location</p><input type="text" value=""></input><br/>
        <p class="request-form-index">Item Name</p><input type="text"></input><br/>
        <p class="request-form-index">Item ID</p><input type="text" placeholder="(Optional)"></input><br/>
        <p class="request-form-index">Item URL</p><input type="text" placeholder="(Optional)"></input><br/>
        <p class="request-form-index">Item Category</p><select><option>Cosmetics</option></select><br/>
        <p class="request-form-index">Want Item by</p><input type="text"></input><br/>
        <p class="request-form-index">Proposed Price (incl. shipping)</p><input type="text"></input><br/>
        <p class="request-form-index">Preferred Delivery Method</p><select><option>Ship</option><option>Pick UP/Meet Up</option></select><br/>
        <p class="request-form-index">Comments</p><input type="text" placeholder="(Optional)"></input><br/>
        <button class="send-request">SEND REQUEST</button>
      </div>

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

    <footer>
      FOOTER CONTENTS TO BE DETERMINED
      <FontAwesomeIcon icon="igloo" />
    </footer>
  </div>
    )
  }
}

export default RequestForm;
