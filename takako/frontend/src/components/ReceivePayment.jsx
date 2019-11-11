import React, { Component } from 'react';
import queryString from 'query-string';
import '../css/style.scss';
import { library } from '@fortawesome/fontawesome-svg-core';
import { faIgloo } from '@fortawesome/free-solid-svg-icons';
import {connect} from 'react-redux';

import Header from './Header';
import SideMenu from './SideMenu';
import Footer from './Footer';
import MobileSideMenu from './MobileSideMenu';

import {requests} from "../actions";

import RateRequester from './RateRequester';

import { keys } from '../keys.js';


class ReceivePayment extends Component {
  componentDidMount() {
    const values = queryString.parse(this.props.location.search);
    if (values.error) {
      this.props.error = values.error_description;
    } else {
      this.props.connectStripeAccount(values);
    }
  }

  getPaid = () => {
    const values = queryString.parse(this.props.location.search);
    this.props.getPaid(values.state);
  }

  render() {
    const values = queryString.parse(this.props.location.search);
    let requestId = values.state;
    if (this.props.error) {
      return (
  <div>
    <Header />

    <div class="wrapper clearfix">
      <SideMenu />
      <div>
        <p>
        </p>
      </div>
      <Footer />
    </div>
  </div>
    )}

    if (this.props.isRated) {
      return (
      <div>
        <Header />
        <div class="wrapper clearfix">
          <SideMenu />
          <div class="request-conf">
            <h3>You got paid!</h3>
            <p>
              You will receive payment in your stripe account in a few days
            </p>
            <p>Thank you for your feedback!</p>
          </div>
        </div>

        <MobileSideMenu />
        <Footer />
      </div>
      )
    }

    if (this.props.isStripeTransferred) {
      return (
  <div>
    <Header />

    <div class="wrapper clearfix">
      <SideMenu />
      <div class="main">
        <h3>You got paid!</h3>
        <p>
          You will receive payment in your stripe account in a few days
        </p>
        <RateRequester requestId={`${requestId}`} />
      </div>
    </div>
    <Footer />
  </div>
      )
    }

    if (this.props.isAlreadyStripeTransferred) {
      return (
    <div>
    <Header />

    <div class="wrapper clearfix">
      <SideMenu />
      <div class="main">
        <h3>You already got paid!</h3>
        <p>
          Please check your stripe account
        </p>
      </div>
    </div>
    <Footer />
  </div>
      )
    }

    if (this.props.isStripeConnected) {
      return (
    <div>
    <Header />

    <div class="wrapper clearfix">
      <SideMenu />
      <div class="main">
        <h3>Awesome, Your stripe account is connected!</h3>
        <p>
          Please get paid by clicking the below button.
        </p>
        <button class="btn" onClick={this.getPaid}>Get Paid</button>
      </div>
    </div>
    <Footer />
  </div>
      )
    }

    return (
  <div>
    <Header />

    <div class="wrapper clearfix">
      <SideMenu />
      <div class="main">
        <h3>Hooray! Your job is completed</h3>
        <p>
          Please connect your stripe account to get paid
        </p>
        <a href={
          `https://connect.stripe.com/oauth/authorize` +
          `?response_type=code&client_id=${keys.STRIPE_CLIENT_ID}&scope=read_write&redirect_uri=${keys.STRIPE_REDIRECT_URI}`
         }>
        }
          <img src={require('../img/blue-on-light.png')} />
        </a>
      </div>
    </div>
    <Footer />
  </div>

    )
  }
}

const mapStateToProps = state => {
  return {
    isStripeConnected: state.requests.isStripeConnected,
    isStripeTransferred: state.requests.isStripeTransferred,
    isAlreadyStripeTransferred: state.requests.isAlreadyStripeTransferred,
    isRated: state.requests.isRated,
  }
}

const mapDispatchToProps = dispatch => {
  return {
    connectStripeAccount: (values) => {
      dispatch(requests.connectStripeAccount(values));
    },
    getPaid: (requestId) => {
      dispatch(requests.getPaid(requestId));
    },
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(ReceivePayment);
