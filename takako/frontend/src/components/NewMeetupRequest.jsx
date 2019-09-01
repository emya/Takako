import React, { Component } from 'react';
import MediaQuery from 'react-responsive';
import '../css/style.scss';
import { library } from '@fortawesome/fontawesome-svg-core'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faIgloo } from '@fortawesome/free-solid-svg-icons'

import moment from 'moment';

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

  componentWillReceiveProps(newProps){
    if(newProps.isSubmissionSucceeded !== this.props.isSubmissionSucceeded){
      this.setState({isSubmissionSucceeded: newProps.isSubmissionSucceeded })
    }
  }

  validateForm = (
    preferred_phone, preferred_email,
    meetup_option1_date, meetup_option1_dtime, meetup_option1_address,
    meetup_option2_date, meetup_option2_dtime, meetup_option2_address,
    meetup_option3_date, meetup_option3_dtime, meetup_option3_address,
    ) => {
    // we are going to store errors for all fields
    // in a signle array
    const errors = [];

    if (preferred_phone.length === 0 && preferred_email.length ===0) {
      errors.push("Either Phone number or Email address is required");
    }

    if (!meetup_option1_date || meetup_option1_dtime.length === 0 || meetup_option1_address.length === 0) {
      errors.push("Meet option 1 is required. Please fill out Date, Time and Address");
    }

    if (!meetup_option2_date || meetup_option2_dtime.length === 0 || meetup_option2_address.length === 0) {
      errors.push("Meet option 2 is required. Please fill out Date, Time and Address");
    }

    if (!meetup_option3_date || meetup_option3_dtime.length === 0 || meetup_option3_address.length === 0) {
      errors.push("Meet option 3 is required. Please fill out Date, Time and Address");
    }

    return errors;
  }

  handleMeetup1DateChange(date) {
    this.setState({meetup_option1_date: date});
  }

  handleMeetup2DateChange(date) {
    this.setState({meetup_option2_date: date});
  }

  handleMeetup3DateChange(date) {
    this.setState({meetup_option3_date: date});
  }

  suggestNewMeetup = (e) => {
    e.preventDefault();
    const errors = this.validateForm(
      this.state.preferred_phone, this.state.preferred_email,
      this.state.meetup_option1_date, this.state.meetup_option1_dtime, this.state.meetup_option1_address,
      this.state.meetup_option2_date, this.state.meetup_option2_dtime, this.state.meetup_option2_address,
      this.state.meetup_option3_date, this.state.meetup_option3_dtime, this.state.meetup_option3_address,
    );

    if (errors.length > 0) {
      this.setState({ errors });
      return;
    }

    let purchase_notification_id = this.props.location.state.requests.purchase_notification[0].id;
    let action_taken_by = this.props.location.state.action_taken_by;
    this.props.suggestNewMeetup(
      purchase_notification_id,
      this.state.meetup_option1_date, this.state.meetup_option1_dtime, this.state.meetup_option1_address, this.state.meetup_option1_comment,
      this.state.meetup_option2_date, this.state.meetup_option2_dtime, this.state.meetup_option2_address, this.state.meetup_option2_comment,
      this.state.meetup_option3_date, this.state.meetup_option3_dtime, this.state.meetup_option3_address, this.state.meetup_option3_comment,
      this.state.preferred_phone, this.state.preferred_email, action_taken_by,
    );

  }

  render() {
    const errors = this.state.errors;

    if (this.state.isSubmissionSucceeded) {
      return (
        <div>
          <Header />

          <div class="wrapper clearfix">
            <SideMenu />
            <div class="request-conf">
              <h3>Your request was successfully submitted</h3>
              <p><a href="/transaction/status" style={{color: "#F17816"}}>
                Back to the conversation
              </a></p>
            </div>
          </div>
          <MobileSideMenu />
          <Footer />
        </div>
      )
    }

    let has_requests = false;
    let requestHistory;
    let action_taken_by;
    if (this.props.location.state.requests) {
      requestHistory = this.props.location.state.requests;
      action_taken_by = this.props.location.state.action_taken_by;
    } else {
      return null
    }
    return (
   <div>
      <Header />

      <div class="wrapper clearfix">
        <SideMenu />
        <form class="form">
          <h2>Request New Meetup Options</h2>

          <div class="form-wrapper">
            <div class="form-section first">
              <p class="form-heading">{requestHistory.respondent.first_name} Contact Info</p><br/>
              <p class="form-data">{requestHistory.purchase_notification[0].preferred_phone} </p><br />
              <p class="form-data">{requestHistory.purchase_notification[0].preferred_email} </p><br />
            </div>

            <div class="form-section">
              {errors.map(error => (
                <p key={error}>Error: {error}</p>
              ))}
              <p class="form-heading">Your Preferred Contact</p><br />
               <input class="contact-option" placeholder="Phone Number" value={this.state.preferred_phone} onChange={(e) => this.setState({preferred_phone: e.target.value})}/>
              <input class="contact-option" placeholder="e-mail" value={this.state.preferred_email} onChange={(e) => this.setState({preferred_email: e.target.value})} />
            </div>

            <div class="form-section">
            <div class="optional-item">
            Meetup/Delivery will take place between {requestHistory.trip.departure_date} - {requestHistory.trip.arrival_date}
            </div>
            <div class="meetup-option-wrapper">
              <p class="form-heading">Meetup Option 1</p>
              <br />
              <DatePicker minDate={moment().toDate()} selected={this.state.meetup_option1_date} onChange={this.handleMeetup1DateChange.bind(this)}/>
              <input class="meetup-option time" placeholder="Choose Time" value={this.state.meetup_option1_dtime} onChange={(e) => this.setState({meetup_option1_dtime: e.target.value})}/><br/>
              <input class="meetup-option" placeholder="Enter Address" value={this.state.meetup_option1_address} onChange={(e) => this.setState({meetup_option1_address: e.target.value})} />
              <input class="meetup-option" placeholder="Note (e.g. front door)" value={this.state.meetup_option1_comment} onChange={(e) => this.setState({meetup_option1_comment: e.target.value})} />
              <br />
              </div>

            <div class="meetup-option-wrapper">
              <p class="form-heading">Meetup Option 2</p><br />
              <DatePicker minDate={moment().toDate()} selected={this.state.meetup_option2_date} onChange={this.handleMeetup2DateChange.bind(this)}/>
              <input class="meetup-option time" placeholder="Choose Time" value={this.state.meetup_option2_dtime} onChange={(e) => this.setState({meetup_option2_dtime: e.target.value})}/><br/>
              <input class="meetup-option" placeholder="Enter Address" value={this.state.meetup_option2_address} onChange={(e) => this.setState({meetup_option2_address: e.target.value})} />
              <input class="meetup-option" placeholder="Note (e.g. front door)" value={this.state.meetup_option2_comment} onChange={(e) => this.setState({meetup_option2_comment: e.target.value})} />
              <br />
            </div>

            <div class="meetup-option-wrapper">
              <p class="form-heading">Meetup Option 3</p><br />
              <DatePicker minDate={moment().toDate()} selected={this.state.meetup_option3_date} onChange={this.handleMeetup3DateChange.bind(this)}/>
              <input class="meetup-option time" placeholder="Choose Time" value={this.state.meetup_option3_dtime} onChange={(e) => this.setState({meetup_option3_dtime: e.target.value})}/><br/>
              <input class="meetup-option" placeholder="Enter Address" value={this.state.meetup_option3_address} onChange={(e) => this.setState({meetup_option3_address: e.target.value})} />
              <input class="meetup-option" placeholder="Note (e.g. front door)" value={this.state.meetup_option3_comment} onChange={(e) => this.setState({meetup_option3_comment: e.target.value})} />
            </div>
            </div>
          </div>

          <button class="form-send-btn btn"
            onClick={this.suggestNewMeetup}>
            Request New Meetup Date/Place
          </button>

        </form>
      </div>
      <MobileSideMenu />
      <Footer />
    </div>
    )
  }
}

const mapStateToProps = state => {
  return {
    isSubmissionSucceeded: state.requests.isSubmissionSucceeded,
  }
}

const mapDispatchToProps = dispatch => {
  return {
    suggestNewMeetup: (
      purchase_notification_id,
      meetup_option1_date, meetup_option1_dtime, meetup_option1_address, meetup_option1_comment,
      meetup_option2_date, meetup_option2_dtime, meetup_option2_address, meetup_option2_comment,
      meetup_option3_date, meetup_option3_dtime, meetup_option3_address, meetup_option3_comment,
      preferred_phone, preferred_email, action_taken_by,
      ) => {
      return dispatch(requests.suggestNewMeetup(
        purchase_notification_id,
        meetup_option1_date, meetup_option1_dtime, meetup_option1_address, meetup_option1_comment,
        meetup_option2_date, meetup_option2_dtime, meetup_option2_address, meetup_option2_comment,
        meetup_option3_date, meetup_option3_dtime, meetup_option3_address, meetup_option3_comment,
        preferred_phone, preferred_email, action_taken_by, "meetup_suggested"
      ));
    },
    logout: () => dispatch(auth.logout()),
  }
}


export default connect(mapStateToProps, mapDispatchToProps)(NewMeetupRequest);
