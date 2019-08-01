import React, { Component } from 'react';
import MediaQuery from 'react-responsive';
import '../css/style.scss';
import { library } from '@fortawesome/fontawesome-svg-core'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faIgloo } from '@fortawesome/free-solid-svg-icons'

import {createStore} from 'redux';
import {Provider, connect} from 'react-redux';

import DatePicker from "react-datepicker";
import {requests, auth} from "../actions";

import Header from './Header';
import SideMenu from './SideMenu';
import MobileSideMenu from './MobileSideMenu';
import Footer from './Footer';

class NewMeetupRequest extends Component {
  state = {
    preferred_phone: "",
    preferred_email: "",
    meetup_option1_date: null,
    meetup_option2_date: null,
    meetup_option3_date: null,
    meetup_option1_dtime: "",
    meetup_option2_dtime: "",
    meetup_option3_dtime: "",
    meetup_option1_address: "",
    meetup_option2_address: "",
    meetup_option3_address: "",
    meetup_option1_comment: "",
    meetup_option2_comment: "",
    meetup_option3_comment: "",
    isSubmissionSucceeded: null,
    errors: []
  }

  validateForm = (preferred_phone, preferred_email, meetup_option1_date, meetup_option1_dtime, meetup_option1_address) => {
    // we are going to store errors for all fields
    // in a signle array
    const errors = [];

    if (preferred_phone.length === 0 && preferred_email.length ===0) {
      errors.push("Either Phone number or Email address is required");
    }

    if (!meetup_option1_date || meetup_option1_dtime.length === 0 || meetup_option1_address.length === 0) {
      errors.push("Meet option 1 is required. Please fill out Date, Time and Address");
    }

    return errors;
  }

  handleMeetupDateChange(date) {
    this.setState({meetup_option1_date: date});
  }

  shareContact = (purchase_notification_id) => {
    this.props.shareContact(purchase_notification_id, this.state.preferred_phone, this.state.preferred_email);
  }

  render() {
    let has_requests = false;
    let requestHistory;
    if (this.props.location.state.requests) {
      requestHistory = this.props.location.state.requests;
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
          <div class="meetup-rule">
            Meetup/Delivery will take place between {requestHistory.trip.departure_date} - {requestHistory.trip.arrival_date}
          </div>
          <div class="form-wrapper">

            <div class="form-section">
              <p class="form-heading">{requestHistory.requester.first_name} Contact Info</p><br/>
              <p class="form-data">{requestHistory.purchase_notification[0].preferred_phone} </p><br />
              <p class="form-data">{requestHistory.purchase_notification[0].preferred_email} </p><br />
            </div>

            <div class="form-section">
              <p class="form-heading">Your Preferred Contact</p><br />
               <input class="contact-option" placeholder="Phone Number" value={this.state.preferred_phone} onChange={(e) => this.setState({preferred_phone: e.target.value})}/>
              <input class="contact-option" placeholder="e-mail" value={this.state.preferred_email} onChange={(e) => this.setState({preferred_email: e.target.value})} />
            </div>

            <div class="form-section">
              <p class="form-heading">Meetup Option 1</p>
              <br />
              <DatePicker selected={this.state.meetup_option1_date} onChange={this.handleMeetupDateChange.bind(this)}/>
              <input class="meetup-option" placeholder="Choose Time" value={this.state.meetup_option1_dtime} onChange={(e) => this.setState({meetup_option1_dtime: e.target.value})}/>
              <input class="meetup-option" placeholder="Enter Address" value={this.state.meetup_option1_address} onChange={(e) => this.setState({meetup_option1_address: e.target.value})} />
              <input class="meetup-option" placeholder="Note (e.g. front door)" value={this.state.meetup_option1_comment} onChange={(e) => this.setState({meetup_option1_comment: e.target.value})} />
              <br />

              <p class="form-heading">Meetup Option 2</p><br />
              <input class="meetup-option" placeholder="Choose Date"/>
              <input class="meetup-option" placeholder="Choose Time"/>
              <input class="meetup-option" placeholder="Enter Address"/>
              <input class="meetup-option" placeholder="Note (e.g. front door)"/><br />

              <p class="form-heading">Meetup Option 3</p><br />
              <input class="meetup-option" placeholder="Choose Date"/>
              <input class="meetup-option" placeholder="Choose Time"/>
              <input class="meetup-option" placeholder="Enter Address"/>
              <input class="meetup-option" placeholder="Note (e.g. front door)"/><br />
            </div>
          </div>

          <button class="form-send-btn btn" onClick={this.proceedRequest}>Request New Meetup Date/Place</button>

        </form>
      </div>
      <MobileSideMenu />
      <Footer />
    </div>
    )
  }
}

const mapDispatchToProps = dispatch => {
  return {
    shareContact: (purchase_notification_id, preferred_phone, preferred_email) => {
      dispatch(requests.shareContact(purchase_notification_id, preferred_phone, preferred_email));
    },
    logout: () => dispatch(auth.logout()),
  }
}


export default connect(null, mapDispatchToProps)(NewMeetupRequest);
