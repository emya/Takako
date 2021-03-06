import React, { Component } from 'react';
import '../css/style.scss';

import {connect} from 'react-redux';

import Header from './Header';
import SideMenu from './SideMenu';
import MobileSideMenu from './MobileSideMenu';
import Footer from './Footer'

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
          { this.props.user && (
            <SideMenu />
          )}
          <div class="request-conf">
            <p>Your message was successfully submitted</p>
          </div>
        </div>

        <MobileSideMenu />
        <Footer />

      </div>
      )
    }

    const errors = this.state.errors;
    return (
    <div>
      <Header />

      <div class="wrapper clearfix">
        { this.props.user && (
          <SideMenu />
        )}

        <form class="form">

          <h2>Contact Us</h2>
          <div class="form-wrapper">
            <div class="introduction">
              <p>Couldn't find answers <a href="http://torimo.io/how-it-works">here</a>?<br/> Reach out to us for your question, request, and feedback. We'd love to hear from you!</p>
            </div>
            <div class="form-section">
              {errors.map(error => (
                <p key={error}>Error: {error}</p>
              ))}
              <p class="form-heading">Name<span class="asterisk">*</span></p><br/>
              <input type="text" maxLength="100" value={this.state.name} onChange={(e) => this.setState({name: e.target.value})} required /><br/>

              <p class="form-heading">Email<span class="asterisk">*</span></p><br/>
              <input type="email" maxLength="200" value={this.state.email} onChange={(e) => this.setState({email: e.target.value})} required /><br/>

              <p class="form-heading">Message<span class="asterisk">*</span></p><br/>
              <input type="text" class="contact-message" maxLength="300" value={this.state.message} onChange={(e) => this.setState({message: e.target.value})}  required /><br/>
            </div>
            <button class="form-send-btn btn" onClick={this.sendContactUs}>Submit</button>
          </div>
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
    user: state.auth.user,
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
