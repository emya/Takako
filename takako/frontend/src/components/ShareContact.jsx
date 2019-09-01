import React, { Component } from 'react';
import MediaQuery from 'react-responsive';
import '../css/style.scss';
import { library } from '@fortawesome/fontawesome-svg-core'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faIgloo } from '@fortawesome/free-solid-svg-icons'

import {createStore} from 'redux';
import {Provider, connect} from 'react-redux';

import {requests, auth} from "../actions";

import Header from './Header';
import SideMenu from './SideMenu';
import MobileSideMenu from './MobileSideMenu';
import Footer from './Footer';

class ShareContact extends Component {
  state = {
    preferred_phone: "",
    preferred_email: "",
    isSubmissionSucceeded: null,
    errors: []
  }

  componentWillReceiveProps(newProps){
     if(newProps.isSubmissionSucceeded !== this.props.isSubmissionSucceeded){
         this.setState({isSubmissionSucceeded: newProps.isSubmissionSucceeded })
     }
  }

  validateForm = (preferred_phone, preferred_email) => {
    // we are going to store errors for all fields
    // in a signle array
    const errors = [];

    if (preferred_phone.length === 0 && preferred_email.length ===0) {
      errors.push("Either Phone number or Email address is required");
    }

    return errors;
  }

  shareContact = (e) => {
    e.preventDefault();
    const errors = this.validateForm(
      this.state.preferred_phone, this.state.preferred_email,
    );

    if (errors.length > 0) {
      this.setState({ errors });
      return;
    }

    this.props.shareContact(
      this.props.location.state.purchase_notification.id,
      this.state.preferred_phone,
      this.state.preferred_email,
      this.props.location.state.meetup.id,
    );
  }

  render() {
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

    console.log(this.props.location.state.meetup);
    const errors = this.state.errors;
    let meetup;
    let purchase_notification;
    if (this.props.location.state.meetup) {
      meetup = this.props.location.state.meetup;
      purchase_notification = this.props.location.state.purchase_notification;
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

            <div class="form-section first">
              <p class="form-heading">Meetup Option you accepted</p><br />
              <p class="form-data meetup">{meetup.date}</p>
              <p class="form-data meetup">{meetup.dtime}</p>
              <p class="form-data meetup">{meetup.address}</p>
              <p class="form-data meetup">{meetup.comment}</p>
            </div>

            <div class="form-section">
              {errors.map(error => (
                <p key={error}>Error: {error}</p>
              ))}
              <p class="form-heading">Your Preferred Contact</p><br />
              <input class="contact-option" placeholder="Phone Number" value={this.state.preferred_phone} onChange={(e) => this.setState({preferred_phone: e.target.value})}/>
              <input class="contact-option" placeholder="e-mail" value={this.state.preferred_email} onChange={(e) => this.setState({preferred_email: e.target.value})} />
            </div>
          </div>

          <button class="form-send-btn btn" onClick={this.shareContact}>Share your contact</button>

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
    shareContact: (purchase_notification_id, preferred_phone, preferred_email, accepted_meetup_id) => {
      dispatch(
        requests.shareContact(
          purchase_notification_id, preferred_phone, preferred_email, accepted_meetup_id, "meetup_decided"
        )
      );
    },
    logout: () => dispatch(auth.logout()),
  }
}


export default connect(mapStateToProps, mapDispatchToProps)(ShareContact);
