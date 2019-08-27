import React, { Component } from 'react';
import {connect} from 'react-redux';
import {Link, Redirect} from "react-router-dom";
import {requests, auth} from "../actions";

import '../css/style.scss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

import Header from './Header';
import SideMenu from './SideMenu';
import MobileSideMenu from './MobileSideMenu';
import Footer from './Footer';
import StripeCheckout from 'react-stripe-checkout';
import { keys } from '../keys.js';

import moment from 'moment';


class TransactionHistory extends Component {
  componentDidMount() {
    this.props.fetchRequestHistory(this.props.match.params.requestId);
  }

  state = {
    text: "",
    updateNoteId: null,
    isDeclineSelected: null,
    decline_reason: 0,
    decline_reason_comment: "",
  }

  selectDeclineItemRequest = () => {
    this.setState({isDeclineSelected: true});
  }

  selectDeclineReason = (e) => {
    this.setState({decline_reason: e.target.value});
  }

  acceptItemRequest = () => {
    console.log(moment().format());
    this.props.updateItemRequest(
      this.props.match.params.requestId,
      {
        "status": 2, "process_status": "request_responded",
        "responded_at": moment().format()
      }
    );
  }

  declineItemRequest = () => {
    this.props.updateItemRequest(
      this.props.match.params.requestId,
      {
        "status": 3, "decline_reason": this.state.decline_reason,
        "decline_reason_comment": this.state.decline_reason_comment,
        "process_status": "request_responded",
        "responded_at": moment().format()
      }
    );
  }

  cancelItemRequest = () => {
    this.props.updateItemRequest(
      this.props.match.params.requestId,
      {"status": 1, "process_status": "request_cancelled", "responded_at": moment().format()}
    );
  }

  onToken = (token, addresses) => {
    // TODO: Send the token information and any other
    /*
    var FormData = require('form-data');
    let body = new FormData();

    body.append("stripeEmail", token.email);
    body.append("stripeToken", token.id);
    body.append("stripeTokenType", token.type);
    */

    var body = {};
    body["stripeEmail"] = token.email;
    body["stripeToken"] = token.id;
    body["stripeTokenType"] = token.type;

    let requestHistory = this.props.requests.requestHistory;
    let amount = requestHistory.transaction_fee + requestHistory.commission_fee + requestHistory.proposed_price;

    this.props.chargeItemRequest(this.props.requests.requestHistory.id, this.props.user.id, body, addresses, amount);
  };

  render() {
    if (this.props.isForbidden) {
      return <Redirect to='/transaction/status' />
    }
    if (this.props.isResponded) {
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

    if (this.state.isDeclineSelected) {
      return (
  <div>
    <Header />

    <div class="wrapper clearfix">
      <SideMenu />
      <div class="form-section">
        <p>Thank you for your response</p>
        <p>Please select reason you decline the offer</p>

        <select onChange={this.selectDeclineReason} value={this.state.decline_reason}>
          <option value="1">The proposed price is not enough</option>
          <option value="2">The commission fee is not enough</option>
          <option value="3">The item is too big/heavy</option>
          <option value="4">The item is hard to get</option>
          <option value="0">Other</option>
        </select>
        <input type="text" class="meetup-option" maxlength="200" placeholder="Comment to share with the reason"
          value={this.state.decline_reason_comment} onChange={(e) => this.setState({decline_reason_comment: e.target.value})} />
        <button class="action-btn decline" onClick={this.declineItemRequest}>Decline</button>
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
    )}

    let has_history = false;
    let is_requester = false;
    let is_traveler = false;
    let item_request_status = 0;
    let process_status;
    let requestHistory;
    if (this.props.requests.requestHistory) {
      has_history = true;
      requestHistory = this.props.requests.requestHistory;

      console.log(requestHistory);

      item_request_status = requestHistory.status;
      process_status = requestHistory.process_status;

      if (this.props.user.id === requestHistory.requester.id){
        is_requester = true;
      }

      if (this.props.user.id === requestHistory.respondent.id){
        is_traveler = true;
      }
    }

    if (!has_history) {
        return null;
    }
    return (
  <div>
     <Header />

      <div class="wrapper clearfix">
       <SideMenu />

       <div class="transaction-history">
         <p class="bread-crumb"><a href="/transaction/status">Back to Transaction Status</a></p>
         {/* This use is requester */
         is_requester && (
           <div>
             <h2>Sent Request</h2>
             <h3>Transaction History with {requestHistory.respondent.first_name}</h3>
             <p>Request you sent</p>
             <p>Item Name:  {requestHistory.item_name}</p>
             <p>Number of Item(s):  {requestHistory.n_items}</p>
             <p>Price    :  {requestHistory.proposed_price.toLocaleString()}</p>
           </div>
         )}
         {
         /* meetup option decided */
         is_requester && item_request_status === 2 && process_status === "meetup_decided" && (
           <div class="history-box initial">
             <div class="history-wrapper">
               <h4>
                 {requestHistory.meetup_decided_at && moment(requestHistory.meetup_decided_at, "YYYY-MM-DD HH:mm:ss").format("YYYY-MM-DD")}
               </h4>
               <p>Meetup place/time decided!</p>
             </div>
             <ul class="request-data">
               <li>DATE   : {requestHistory.purchase_notification[0].final_meetup.date}</li>
               <li>TIME   : {requestHistory.purchase_notification[0].final_meetup.dtime}</li>
               <li>ADDRESS: {requestHistory.purchase_notification[0].final_meetup.address}</li>
             </ul>
             <h3>Contact Info of {requestHistory.respondent.first_name}</h3>
             <p> {requestHistory.purchase_notification[0].preferred_phone} </p>
             <p> {requestHistory.purchase_notification[0].preferred_email} </p>
           </div>
         )}
         {
         /* meetup option suggested by this requester */
         is_requester && item_request_status === 2 &&
         process_status === "meetup_suggested" && requestHistory.purchase_notification[0].action_taken_by == 1 && (
           <div class="history-box meetups">
             <div class="history-wrapper">
               <h4>
                 {requestHistory.meetup_suggested_at && moment(requestHistory.meetup_suggested_at, "YYYY-MM-DD HH:mm:ss").format("YYYY-MM-DD")}
               </h4>
               <p>You suggested following meetup options</p>
             </div>
             <ul class="request-data">
               <li>Phone number: {requestHistory.purchase_notification[0].preferred_phone} </li>
               <li>Email address: {requestHistory.purchase_notification[0].preferred_email} </li>
               <li>Meetup option1:</li>
               <li>
                 <ul class="request-data">
                   <li>Date   :{requestHistory.purchase_notification[0].meetup_option1.date}</li>
                   <li>Time   :{requestHistory.purchase_notification[0].meetup_option1.dtime}</li>
                   <li>Address:{requestHistory.purchase_notification[0].meetup_option1.address}</li>
                 </ul>
               </li>

               <li>Meetup option2:</li>
               <li>
                 <ul class="request-data">
                   <li>Date   :{requestHistory.purchase_notification[0].meetup_option2.date}</li>
                   <li>Time   :{requestHistory.purchase_notification[0].meetup_option2.dtime}</li>
                   <li>Address:{requestHistory.purchase_notification[0].meetup_option2.address}</li>
                 </ul>
               </li>

               <li>Meetup option3:</li>
               <li>
                 <ul class="request-data">
                   <li>Date   :{requestHistory.purchase_notification[0].meetup_option3.date}</li>
                   <li>Time   :{requestHistory.purchase_notification[0].meetup_option3.dtime}</li>
                   <li>Address:{requestHistory.purchase_notification[0].meetup_option3.address}</li>
                 </ul>
               </li>
             </ul>
           </div>
         )}
         {
         /* meetup option suggested by traveler */
         is_requester && item_request_status === 2 &&
         process_status === "meetup_suggested" && requestHistory.purchase_notification[0].action_taken_by == 0 && (
           <div class="history-box meetups">
             <div class="history-wrapper">
               <h4>
                 {requestHistory.purchase_notified_at && moment(requestHistory.purchase_notified_at, "YYYY-MM-DD HH:mm:ss").format("YYYY-MM-DD")}
               </h4>
               <p>{requestHistory.respondent.first_name} purchased the item you requested </p>
             </div>
             <ul class="request-data">
               <li>Phone number: {requestHistory.purchase_notification[0].preferred_phone} </li>
               <li>Email address: {requestHistory.purchase_notification[0].preferred_email} </li>
               <li>Meetup option1:</li>
               <li>
                 <ul class="request-data">
                   <li>Date   :{requestHistory.purchase_notification[0].meetup_option1.date}</li>
                   <li>Time   :{requestHistory.purchase_notification[0].meetup_option1.dtime}</li>
                   <li>Address:{requestHistory.purchase_notification[0].meetup_option1.address}</li>
                 </ul>
               </li>
               <Link to={{
                   pathname: "/share/contact",
                   state: {
                     purchase_notification: requestHistory.purchase_notification[0],
                     meetup: requestHistory.purchase_notification[0].meetup_option1,
                   }
                 }}>
                 <button class="btn accept">Accept</button>
               </Link>

               <li>Meetup option2:</li>
               <li>
                 <ul class="request-data">
                   <li>Date   :{requestHistory.purchase_notification[0].meetup_option2.date}</li>
                   <li>Time   :{requestHistory.purchase_notification[0].meetup_option2.dtime}</li>
                   <li>Address:{requestHistory.purchase_notification[0].meetup_option2.address}</li>
                 </ul>
               </li>
               <Link to={{
                   pathname: "/share/contact",
                   state: {
                     purchase_notification: requestHistory.purchase_notification[0],
                     meetup: requestHistory.purchase_notification[0].meetup_option2,
                   }
                 }}>
                 <button class="btn accept">Accept</button>
               </Link>

               <li>Meetup option3:</li>
               <li>
                 <ul class="request-data">
                   <li>Date   :{requestHistory.purchase_notification[0].meetup_option3.date}</li>
                   <li>Time   :{requestHistory.purchase_notification[0].meetup_option3.dtime}</li>
                   <li>Address:{requestHistory.purchase_notification[0].meetup_option3.address}</li>
                 </ul>
               </li>
               <Link to={{
                   pathname: "/share/contact",
                   state: {
                     purchase_notification: requestHistory.purchase_notification[0],
                     meetup: requestHistory.purchase_notification[0].meetup_option3,
                   }
                 }}>
                 <button class="btn accept">Accept</button>
               </Link>
             </ul>
             <Link to={{
                   pathname: "/request/meetup/form",
                   state: {
                     requests: requestHistory,
                     action_taken_by: 1,
                   }
                 }} style={{color: "black"}}>Suggest other meetup options
             </Link>
           </div>
         )}
         {
         /* the traveler already notified */
         is_requester && item_request_status === 2 && process_status === "purchase_notified" && (
           <div class="history-box meetups">
             <div class="history-wrapper">
               <h4>
                 {requestHistory.purchase_notified_at && moment(requestHistory.purchase_notified_at, "YYYY-MM-DD HH:mm:ss").format("YYYY-MM-DD")}
               </h4>
               <p>{requestHistory.respondent.first_name} purchased the item you requested </p>
             </div>
             <ul class="request-data">
               <li>Phone number: {requestHistory.purchase_notification[0].preferred_phone} </li>
               <li>Email address: {requestHistory.purchase_notification[0].preferred_email} </li>
               <li>Meetup option1:</li>
               <li>
                 <ul class="request-data">
                   <li>Date   :{requestHistory.purchase_notification[0].meetup_option1.date}</li>
                   <li>Time   :{requestHistory.purchase_notification[0].meetup_option1.dtime}</li>
                   <li>Address:{requestHistory.purchase_notification[0].meetup_option1.address}</li>
                 </ul>
               </li>
               <Link to={{
                   pathname: "/share/contact",
                   state: {
                     purchase_notification: requestHistory.purchase_notification[0],
                     meetup: requestHistory.purchase_notification[0].meetup_option1,
                   }
                 }}>
                 <button class="btn accept">Accept</button>
               </Link>

               <li>Meetup option2:</li>
               <li>
                 <ul class="request-data">
                   <li>Date   :{requestHistory.purchase_notification[0].meetup_option2.date}</li>
                   <li>Time   :{requestHistory.purchase_notification[0].meetup_option2.dtime}</li>
                   <li>Address:{requestHistory.purchase_notification[0].meetup_option2.address}</li>
                 </ul>
               </li>
               <Link to={{
                   pathname: "/share/contact",
                   state: {
                     purchase_notification: requestHistory.purchase_notification[0],
                     meetup: requestHistory.purchase_notification[0].meetup_option2,
                   }
                 }}>
                 <button class="btn accept">Accept</button>
               </Link>

               <li>Meetup option3:</li>
               <li>
                 <ul class="request-data">
                   <li>Date   :{requestHistory.purchase_notification[0].meetup_option3.date}</li>
                   <li>Time   :{requestHistory.purchase_notification[0].meetup_option3.dtime}</li>
                   <li>Address:{requestHistory.purchase_notification[0].meetup_option3.address}</li>
                 </ul>
               </li>
               <Link to={{
                   pathname: "/share/contact",
                   state: {
                     purchase_notification: requestHistory.purchase_notification[0],
                     meetup: requestHistory.purchase_notification[0].meetup_option3,
                   }
                 }}>
                 <button class="btn accept">Accept</button>
               </Link>
             </ul>
             <Link to={{
                   pathname: "/request/meetup/form",
                   state: {
                     requests: requestHistory,
                     action_taken_by: 1,
                   }
                 }} style={{color: "black"}}>Suggest other meetup options
             </Link>
           </div>
         )}

         {/* the requester made payment */
         is_requester && requestHistory.paid_at && (
           <div class="history-box">
             <div class="history-wrapper">
               <h4>
                 {requestHistory.paid_at && moment(requestHistory.paid_at, "YYYY-MM-DD HH:mm:ss").format("YYYY-MM-DD")}
               </h4>
               <p>You completed payment</p>
             </div>
           </div>
         )}

         {/* the user doesn't pay yet */
         is_requester && item_request_status === 2 && process_status === "request_responded" && (
           <div class="history-box initial">
             <div class="history-wrapper">
               <p>Payment Detail</p>
               <ul class="request-data">
                 <li>Proposed Price:   {requestHistory.proposed_price}</li>
                 <li>Commission Fee:   {requestHistory.commission_fee}</li>
                 <li>Transaction Fee (3% of the proposed price):   {requestHistory.transaction_fee}</li>
                 <li>
                 Total Payment: {requestHistory.transaction_fee + requestHistory.commission_fee + requestHistory.proposed_price}
                 </li>
               </ul>

               <StripeCheckout
                 stripeKey={keys.STRIPE_PUBLISHABLE_KEY}
                 token={this.onToken}
                 amount={(requestHistory.transaction_fee + requestHistory.commission_fee + requestHistory.proposed_price)*100}
                 billingAddress={true}
               />

             </div>
           </div>
         )}
         {/* the traveler doesn't respond yet */
         is_requester && process_status === "request_sent" && (
           <div class="history-box">
             <div class="history-wrapper">
               <p>Waiting response by {requestHistory.respondent.first_name}</p>
             </div>
           </div>
         )}
         {/* the traveler rejected */
         is_requester && item_request_status === 3 && (
           <div class="history-box initial">
             <div class="history-wrapper">
               <h4>
                 {requestHistory.responded_at && moment(requestHistory.responded_at, "YYYY-MM-DD HH:mm:ss").format("YYYY-MM-DD")}
               </h4>
               <p>Your request was rejected by {requestHistory.respondent.first_name}</p>

               <p>
                  {requestHistory.decline_reason === 1 && ("Reason: The proposed price is not enough")}
                  {requestHistory.decline_reason === 2 && ("Reason: The commission fee is not enough")}
                  {requestHistory.decline_reason === 3 && ("Reason: The item is too big/heavy")}
                  {requestHistory.decline_reason === 4 && ("Reason: The item is hard to get")}
               </p>
               <p>
                  {requestHistory.decline_reason_comment !== "" && (requestHistory.decline_reason_comment)}
               </p>
             </div>
           </div>
         )}
         {/* the traveler accepted */
         is_requester && item_request_status === 2 && (
           <div class="history-box">
             <div class="history-wrapper">
               <h4>
                 {requestHistory.responded_at && moment(requestHistory.responded_at, "YYYY-MM-DD HH:mm:ss").format("YYYY-MM-DD")}
               </h4>
               <p>Your request was accepted by {requestHistory.respondent.first_name}</p>
             </div>
           </div>
         )}
         {/*the request was cancelled*/
         is_requester && item_request_status === 1 && (
           <div class="history-box">
             <div class="history-wrapper">
               <h4>
                 {requestHistory.responded_at && moment(requestHistory.responded_at, "YYYY-MM-DD HH:mm:ss").format("YYYY-MM-DD")}
               </h4>
               <p>You cancelled the request</p>
             </div>
           </div>
         )}

         {/* This use is traveler */
         is_traveler && (
           <div>
             <h2>Received Request</h2>
             <h3>Transaction History with {requestHistory.requester.first_name}</h3>
             <p>Request {requestHistory.requester.first_name} sent</p>
             <p>Item Name:  {requestHistory.item_name}</p>
             <p>Price    :  {requestHistory.proposed_price.toLocaleString()}</p>
           </div>
         )}

         {
         /* meetup option decided */
         is_traveler && item_request_status === 2 && process_status === "meetup_decided" && (
           <div class="history-box initial">
             <h4>
               {requestHistory.meetup_decided_at && moment(requestHistory.meetup_decided_at, "YYYY-MM-DD HH:mm:ss").format("YYYY-MM-DD")}
             </h4>
             <div class="history-wrapper">
               <p>Meetup place/time decided!</p>
             </div>`
             <ul class="request-data">
               <li>DATE   : {requestHistory.purchase_notification[0].final_meetup.date}</li>
               <li>TIME   : {requestHistory.purchase_notification[0].final_meetup.dtime}</li>
               <li>ADDRESS: {requestHistory.purchase_notification[0].final_meetup.address}</li>
             </ul>
             <h3>Contact Info of {requestHistory.requester.first_name}</h3>
             <p> {requestHistory.purchase_notification[0].shared_contact[0].preferred_phone} </p>
             <p> {requestHistory.purchase_notification[0].shared_contact[0].preferred_email} </p>
           </div>
         )}

         {
         /* meetup option suggested by this traveler */
         is_traveler && item_request_status === 2 &&
         process_status === "meetup_suggested" && requestHistory.purchase_notification[0].action_taken_by == 0 && (
           <div class="history-box meetups">
             <h4>
               {requestHistory.meetup_suggested_at && moment(requestHistory.meetup_suggested_at, "YYYY-MM-DD HH:mm:ss").format("YYYY-MM-DD")}
             </h4>
             <div class="history-wrapper">
               <p>You suggested following meetup options</p>
             </div>
             <ul class="request-data">
               <li>Phone number: {requestHistory.purchase_notification[0].preferred_phone} </li>
               <li>Email address: {requestHistory.purchase_notification[0].preferred_email} </li>
               <li>Meetup option1:</li>
               <li>
                 <ul class="request-data">
                   <li>Date   :{requestHistory.purchase_notification[0].meetup_option1.date}</li>
                   <li>Time   :{requestHistory.purchase_notification[0].meetup_option1.dtime}</li>
                   <li>Address:{requestHistory.purchase_notification[0].meetup_option1.address}</li>
                 </ul>
               </li>

               <li>Meetup option2:</li>
               <li>
                 <ul class="request-data">
                   <li>Date   :{requestHistory.purchase_notification[0].meetup_option2.date}</li>
                   <li>Time   :{requestHistory.purchase_notification[0].meetup_option2.dtime}</li>
                   <li>Address:{requestHistory.purchase_notification[0].meetup_option2.address}</li>
                 </ul>
               </li>

               <li>Meetup option3:</li>
               <li>
                 <ul class="request-data">
                   <li>Date   :{requestHistory.purchase_notification[0].meetup_option3.date}</li>
                   <li>Time   :{requestHistory.purchase_notification[0].meetup_option3.dtime}</li>
                   <li>Address:{requestHistory.purchase_notification[0].meetup_option3.address}</li>
                 </ul>
               </li>
             </ul>
           </div>
         )}

         {
         /* the traveler already notified */
         is_traveler && item_request_status === 2 && process_status === "purchase_notified" && (
           <div class="history-box meetups">
             <div class="history-wrapper">
               <h4>
                 {requestHistory.purchase_notified_at && moment(requestHistory.purchase_notified_at, "YYYY-MM-DD HH:mm:ss").format("YYYY-MM-DD")}
               </h4>
               <p>You purchased the requested item </p>
             </div>
             <ul class="request-data">
               <li>You shared the following information</li>
               <li>Phone number: {requestHistory.purchase_notification[0].preferred_phone} </li>
               <li>Email address: {requestHistory.purchase_notification[0].preferred_email} </li>

               <li>You suggested following meetup options</li>
               <li>Meetup option1:</li>
               <li>
                 <ul class="request-data">
                   <li>Date   :{requestHistory.purchase_notification[0].meetup_option1.date}</li>
                   <li>Time   :{requestHistory.purchase_notification[0].meetup_option1.dtime}</li>
                   <li>Address:{requestHistory.purchase_notification[0].meetup_option1.address}</li>
                 </ul>
               </li>

               <li>Meetup option2:</li>
               <li>
                 <ul class="request-data">
                   <li>Date   :{requestHistory.purchase_notification[0].meetup_option2.date}</li>
                   <li>Time   :{requestHistory.purchase_notification[0].meetup_option2.dtime}</li>
                   <li>Address:{requestHistory.purchase_notification[0].meetup_option2.address}</li>
                 </ul>
               </li>

               <li>Meetup option3:</li>
               <li>
                 <ul class="request-data">
                   <li>Date   :{requestHistory.purchase_notification[0].meetup_option3.date}</li>
                   <li>Time   :{requestHistory.purchase_notification[0].meetup_option3.dtime}</li>
                   <li>Address:{requestHistory.purchase_notification[0].meetup_option3.address}</li>
                 </ul>
               </li>
             </ul>
           </div>
         )}

         {
         /* meetup option suggested by requester */
         is_traveler && item_request_status === 2 &&
         process_status === "meetup_suggested" && requestHistory.purchase_notification[0].action_taken_by == 1 && (
           <div class="history-box meetups">
             <h4>
               {requestHistory.meetup_suggested_at && moment(requestHistory.meetup_suggested_at, "YYYY-MM-DD HH:mm:ss").format("YYYY-MM-DD")}
             </h4>

             <div class="history-wrapper">
               <p>{requestHistory.requester.first_name} suggested following meetup options </p>
             </div>
             <ul class="request-data">
               <li>Phone number: {requestHistory.purchase_notification[0].preferred_phone} </li>
               <li>Email address: {requestHistory.purchase_notification[0].preferred_email} </li>
               <li>Meetup option1:</li>
               <li>
                 <ul class="request-data">
                   <li>Date   :{requestHistory.purchase_notification[0].meetup_option1.date}</li>
                   <li>Time   :{requestHistory.purchase_notification[0].meetup_option1.dtime}</li>
                   <li>Address:{requestHistory.purchase_notification[0].meetup_option1.address}</li>
                 </ul>
               </li>
               <Link to={{
                   pathname: "/share/contact",
                   state: {
                     purchase_notification: requestHistory.purchase_notification[0],
                     meetup: requestHistory.purchase_notification[0].meetup_option1,
                   }
                 }}>
                 <button class="btn accept">Accept</button>
               </Link>

               <li>Meetup option2:</li>
               <li>
                 <ul class="request-data">
                   <li>Date   :{requestHistory.purchase_notification[0].meetup_option2.date}</li>
                   <li>Time   :{requestHistory.purchase_notification[0].meetup_option2.dtime}</li>
                   <li>Address:{requestHistory.purchase_notification[0].meetup_option2.address}</li>
                 </ul>
               </li>
               <Link to={{
                   pathname: "/share/contact",
                   state: {
                     purchase_notification: requestHistory.purchase_notification[0],
                     meetup: requestHistory.purchase_notification[0].meetup_option2,
                   }
                 }}>
                 <button class="btn accept">Accept</button>
               </Link>

               <li>Meetup option3:</li>
               <li>
                 <ul class="request-data">
                   <li>Date   :{requestHistory.purchase_notification[0].meetup_option3.date}</li>
                   <li>Time   :{requestHistory.purchase_notification[0].meetup_option3.dtime}</li>
                   <li>Address:{requestHistory.purchase_notification[0].meetup_option3.address}</li>
                 </ul>
               </li>
               <Link to={{
                   pathname: "/share/contact",
                   state: {
                     purchase_notification: requestHistory.purchase_notification[0],
                     meetup: requestHistory.purchase_notification[0].meetup_option3,
                   }
                 }}>
                 <button class="btn accept">Accept</button>
               </Link>

             </ul>
             <Link to={{
                   pathname: "/request/meetup/form",
                   state: {
                     requests: requestHistory,
                     action_taken_by: 0,
                   }
                 }} style={{color: "black"}}>Suggest other meetup options
             </Link>
           </div>
         )}

         {/* the traveler accepted request but payment is not made yet */
         is_traveler && item_request_status === 2 && process_status === "request_responded" && (
         <div>
           <div class="history-box">
             <div class="history-wrapper">
               <p>Waiting payment by {requestHistory.respondent.first_name}</p>
             </div>
           </div>
         </div>
         )}

         {/* the requester made payment so the traveler notify the purchase */
         is_traveler && process_status === "payment_made" && (
         <div>
           <div class="history-box">
             <div class="history-wrapper">
               <p>Notify that you purchased the item
                 <Link to={{
                   pathname: `/notification/purchase/form/${this.props.match.params.requestId}`,
                   state: {
                     requests: this.state.requests,
                   }
                 }} style={{color: "black"}}>Notify
                 </Link>
               </p>
             </div>
           </div>
         </div>
         )}

         {/* the requester made payment */
         is_traveler && requestHistory.paid_at && (
           <div class="history-box">
             <div class="history-wrapper">
               <h4>
                 {requestHistory.paid_at && moment(requestHistory.paid_at, "YYYY-MM-DD HH:mm:ss").format("YYYY-MM-DD")}
               </h4>
               <p>Payment completed by {requestHistory.respondent.first_name}</p>
             </div>
           </div>
         )}

         {/*the traveler rejected the request*/
         is_traveler && item_request_status === 3 && (
           <div class="history-box initial">
             <div class="history-wrapper">
               <h4>
                 {requestHistory.responded_at && moment(requestHistory.responded_at, "YYYY-MM-DD HH:mm:ss").format("YYYY-MM-DD")}
               </h4>
               <p>You rejected the request</p>

               <p>
                  {requestHistory.decline_reason === 1 && ("Reason: The proposed price is not enough")}
                  {requestHistory.decline_reason === 2 && ("Reason: The commission fee is not enough")}
                  {requestHistory.decline_reason === 3 && ("Reason: The item is too big/heavy")}
                  {requestHistory.decline_reason === 4 && ("Reason: The item is hard to get")}
               </p>
               <p>
                  {requestHistory.decline_reason_comment !== "" && (requestHistory.decline_reason_comment)}
               </p>
             </div>
           </div>
         )}

         {/*the traveler rejected the request*/
         is_traveler && item_request_status === 2 && (
           <div class="history-box">
             <div class="history-wrapper">
               <h4>
                 {requestHistory.responded_at && moment(requestHistory.responded_at, "YYYY-MM-DD HH:mm:ss").format("YYYY-MM-DD")}
               </h4>
               <p>You accepted the request</p>
             </div>
           </div>
         )}

         {/*the request was cancelled*/
         is_traveler && item_request_status === 1 && (
           <div class="history-box">
             <div class="history-wrapper">
               <h4>
                 {requestHistory.responded_at && moment(requestHistory.responded_at, "YYYY-MM-DD HH:mm:ss").format("YYYY-MM-DD")}
               </h4>
               <p>The request was cancelled</p>
             </div>
           </div>
         )}

         <div class="history-box initial">
           <div class="history-wrapper">
             <h4>
               {requestHistory.created_at && moment(requestHistory.created_at, "YYYY-MM-DD HH:mm:ss").format("YYYY-MM-DD")}
             </h4>
             {is_requester ? (
               <p>Request sent by You</p>
             ) : (
               <p>Request sent by {requestHistory.requester.first_name}</p>
             )}
           </div>
           <ul class="request-data">
             {is_traveler ? (
               <li>User Name:   You</li>
             ) : (
               <li>User Name:   {requestHistory.respondent.first_name}</li>
             )}
             <li>Location:   {requestHistory.trip.destination}</li>
             <li>Item Name:  {requestHistory.item_name}</li>
             <li>Item URL (Optional):   {requestHistory.item_url}</li>
             <li>Number of Item(s):   {requestHistory.n_items}</li>
             <li>Proposed Price:   {requestHistory.proposed_price.toLocaleString()}</li>
             <li>Commission Fee:   {requestHistory.commission_fee.toLocaleString()}</li>
             {is_requester && ( <li>Transaction Fee:   {requestHistory.transaction_fee.toLocaleString()}</li>)}
             {is_requester && (
               <li>
                 Total Payment: {(requestHistory.transaction_fee + requestHistory.commission_fee + requestHistory.proposed_price).toLocaleString()}
               </li>
             )}
             <li>Delivery Method:   Meetup</li>
             <li>Comments (Optional): {requestHistory.comment}</li>
           </ul>
             {is_traveler  && requestHistory.status === 0 && (
               <div>
                 <button class="action-btn" onClick={this.acceptItemRequest}>Accept</button>
                 <button class="action-btn decline" onClick={this.selectDeclineItemRequest}>Decline</button>
               </div>
             )}
             {is_requester  && requestHistory.status === 0 && (
               <div>
                 <button class="action-btn decline" onClick={this.cancelItemRequest}>Cancel request</button>
               </div>
             )}
         </div>
       </div>
     </div>

     <MobileSideMenu />
     <Footer />
   </div>
    )
  }
}


const mapStateToProps = state => {
  return {
    isForbidden: state.requests.isForbidden,
    isResponded: state.requests.isResponded,
    requests: state.requests,
    user: state.auth.user,
  }
}


const mapDispatchToProps = dispatch => {
  return {
    fetchRequestHistory: (requestId) => {
      dispatch(requests.fetchRequestHistory(requestId));
    },
    updateItemRequest: (requestId, item_request) => {
      return dispatch(requests.updateItemRequest(requestId, item_request));
    },
    chargeItemRequest: (itemRequestId, userId, body, addresses, amount) => {
      return dispatch(requests.chargeItemRequest(itemRequestId, userId, body, addresses, amount));
    },
    logout: () => dispatch(auth.logout()),
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(TransactionHistory);
