import React, { Component } from 'react';
import MediaQuery from 'react-responsive';
import {requests, auth} from "../actions";
import '../css/style.scss';
import { library } from '@fortawesome/fontawesome-svg-core'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faIgloo } from '@fortawesome/free-solid-svg-icons'

import DatePicker from "react-datepicker";

import {createStore} from 'redux';
import {Provider, connect} from 'react-redux';

import Header from './Header'
import SideMenu from './SideMenu'

class PurchaseNotification extends Component {

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
    if(newProps.isSubmissionSucceeded != this.props.isSubmissionSucceeded){
      this.setState({isSubmissionSucceeded: newProps.isSubmissionSucceeded })
    }
  }

  validateForm = (preferred_phone, preferred_email, meetup_option1_date, meetup_option1_dtime, meetup_option1_address) => {
    // we are going to store errors for all fields
    // in a signle array
    console.log(preferred_phone, preferred_email, meetup_option1_date);
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

  notifyPurchase = (e) => {
    e.preventDefault();
    const errors = this.validateForm(
      this.state.preferred_phone, this.state.preferred_email,
      this.state.meetup_option1_date, this.state.meetup_option1_dtime,
      this.state.meetup_option1_address
    );

    console.log("error", errors);

    if (errors.length > 0) {
      this.setState({ errors });
      return;
    }

    this.props.sendPurchaseNotification(
      this.props.match.params.requestId, this.state.preferred_phone, this.state.preferred_email,
      this.state.meetup_option1_date, this.state.meetup_option1_dtime,
      this.state.meetup_option1_address, this.state.meetup_option1_comment
    );
  }

  render() {
    console.log(this.props.requests);
    console.log(this.state);
    const errors = this.state.errors;

    if (this.state.isSubmissionSucceeded) {
      return (
      <div>
        <Header />

        <div class="wrapper clearfix">
         <SideMenu />
         <div class="request-conf">
          <p>Your notification was successfully submitted</p>
          <p><a href={`/transaction/history/${this.props.match.params.requestId}`} style={{color: "black"}}>
            Back to the conversation
          </a></p>
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
    return (
   <div>
      <Header />

      <div class="wrapper clearfix">
        <SideMenu />
        <form class="form">
          <h2>Notify Purchase and Arrange Meetup</h2>
          <div class="meetup-rule">Meetup/Delivery will take place between 1/1/2019 - 1/30/2019</div>
          <div class="form-wrapper">

            <div class="form-section">
              <p>Good job! You completed the following task!</p>
              <p class="form-heading">Requester</p><br/>
              {this.props.requests.requestHistory && (
                <div>
                  <p class="form-data">{this.props.requests.requestHistory.requester.first_name}</p>
                </div>
              )}
              <p class="form-heading">Item Name</p><br/>
              {this.props.requests.requestHistory && (
                <div>
                  <p class="form-data">{this.props.requests.requestHistory.item_name}</p>
                </div>
              )}
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
          <button class="form-send-btn btn" onClick={this.notifyPurchase}>Notify and Request</button>
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

    <footer>
      FOOTER CONTENTS TO BE DETERMINED
      <FontAwesomeIcon icon="igloo" />
    </footer>
  </div>
    )
  }
}

const mapStateToProps = state => {
  console.log("state", state);
  return {
    requests: state.requests,
    user: state.auth.user,
    isSubmissionSucceeded: state.requests.isSubmissionSucceeded,
  }
}


const mapDispatchToProps = dispatch => {
  return {
    sendPurchaseNotification: (
      item_request_id, preferred_phone, preferred_email,
      meetup_option1_date, meetup_option1_dtime, meetup_option1_address, meetup_option1_comment
    ) => {
      return dispatch(requests.sendPurchaseNotification(
        item_request_id, preferred_phone, preferred_email,
        meetup_option1_date, meetup_option1_dtime, meetup_option1_address, meetup_option1_comment
      ));
    },
    logout: () => dispatch(auth.logout()),
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(PurchaseNotification);
