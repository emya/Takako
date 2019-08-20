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

import {contact} from "../actions";

class ContactUs extends Component {
  state = {
    name: "",
    email: "",
    message: "",
    errors: []
  }

  validateForm = (name, email, message) => {
    // we are going to store errors for all fields
    // in a signle array
    const errors = [];

    if (name.length === 0 || email.length === 0 || message.length === 0) {
      errors.push("Name, email and message can't be empty");
    }

    return errors;
  }

  sendContactUs = (e) => {
    e.preventDefault();
    const errors = this.validateForm(
      this.state.name, this.state.email, this.state.message);

    if (errors.length > 0) {
      this.setState({ errors });
      return;
    }

    this.props.sendContactUs(this.state.name, this.state.email, this.state.message);
  }

  render() {
    if (this.props.isSubmissionSucceeded) {
     return (
      <div>
        <Header />

        <div class="wrapper clearfix">
          <SideMenu />
          <div class="request-conf">
            <p>Your message was successfully submitted</p>
          </div>
        </div>

        <MobileSideMenu />

        <footer>
          FOOTER CONTENTS TO BE DETERMINED
          <FontAwesomeIcon icon="igloo" />
        </footer>
      </div>
      )
    }

    const errors = this.state.errors;
    return (
    <div>
      <Header />

      <div class="wrapper clearfix">
        <SideMenu />

        <form class="form">

          <h2>Contact Us</h2>
          <div class="form-wrapper">
            <h3>How can we Help you?</h3>
            <p>If you have a question, request, and feedback, we would love to hear it!</p>

            <div class="form-section">
              {errors.map(error => (
                <p key={error}>Error: {error}</p>
              ))}
              <p class="form-heading">Name<span class="asterisk">*</span></p><br/>
              <input type="text" maxLength="100" value={this.state.name} onChange={(e) => this.setState({name: e.target.value})} required /><br/>

              <p class="form-heading">Email<span class="asterisk">*</span></p><br/>
              <input type="email" maxLength="200" value={this.state.email} onChange={(e) => this.setState({email: e.target.value})} required /><br/>

              <p class="form-heading">Message<span class="asterisk">*</span></p><br/>
              <input type="text" maxLength="300" value={this.state.message} onChange={(e) => this.setState({message: e.target.value})}  required /><br/>
            </div>
            <button class="form-send-btn btn" onClick={this.sendContactUs}>Submit</button>
          </div>
        </form>
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
  console.log(state);
  return {
    isSubmissionSucceeded: state.contact.isSubmissionSucceeded,
  }
}

const mapDispatchToProps = dispatch => {
  return {
    sendContactUs: (name, email, message)  => {
      return dispatch(
        contact.sendContactUs(name, email, message)
      );
      //dispatch(notes.updateNote(id, text));
    },
  }
}



export default connect(mapStateToProps, mapDispatchToProps)(ContactUs);