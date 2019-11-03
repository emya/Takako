import React, { Component } from 'react';
import {connect} from 'react-redux';
import {Link, Redirect} from "react-router-dom";
import {requests, auth} from "../actions";

import '../css/style.scss';

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
      {
        "status": 1,
        "process_status": "request_cancelled",
        "responded_at": moment().format()
      },
      "cancel_request"
    );
  }

  cancelItemRequestbyTraveler = () => {
    this.props.updateItemRequest(
      this.props.match.params.requestId,
      {
        "status": 4,
        "process_status": "request_cancelled_by_traveler",
        "responded_at": moment().format()
      },
      "cancel_request"
    );
  }

  receiveItem = () => {
    this.props.updateItemRequest(
      this.props.match.params.requestId,
      {
        "process_status": "item_received",
        "item_received_at": moment().format()
      },
      "item_received"
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
    if (this.props.isForbidden || this.props.isNotFound) {
      return <Redirect to='/transaction/status' />
    }

    if (this.props.isCancelled) {
      return (
      <div>
        <Header />

        <div class="wrapper clearfix">
          <SideMenu />
          <div class="request-conf">
            <h3>Cancellation</h3>
            <p>You cancelled the request</p>
            <p><a href={`/transaction/history/${this.props.match.params.requestId}`} style={{color: "#f17816"}}>
              Back to the conversation
            </a></p>
          </div>
        </div>

        <MobileSideMenu />
        <Footer />
      </div>
      )
    }

    if (this.props.isItemReceived) {
      return (
      <div>
        <Header />

        <div class="wrapper clearfix">
          <SideMenu />
          <div class="request-conf">
            <h3>Congratulations!</h3>
            <p>Your request was completed!</p>
            <p><a href={`/transaction/history/${this.props.match.params.requestId}`} style={{color: "#f17816"}}>
              Back to the conversation
            </a></p>
          </div>
        </div>

        <MobileSideMenu />
        <Footer />
      </div>
      )
    }

    if (this.props.isResponded) {
     return (
      <div>
        <Header />

        <div class="wrapper clearfix">
          <SideMenu />
          <div class="request-conf">
            <h3>Thank you!</h3>
            <p>Your notification was successfully submitted</p>
            <p><a href={`/transaction/history/${this.props.match.params.requestId}`} style={{color: "#f17816"}}>
              Back to the conversation
            </a></p>
          </div>
        </div>

        <MobileSideMenu />
        <Footer />
      </div>
      )
    }

    if (this.props.isPaymentCompleted) {
     return (
      <div>
        <Header />

        <div class="wrapper clearfix">
          <SideMenu />
          <div class="request-conf">
          <h3>Thank you!</h3>
            <p>Your payment was successfully completed</p>
            <p><a href={`/transaction/history/${this.props.match.params.requestId}`} style={{color: "#f17816"}}>
              Back to the conversation
            </a></p>
          </div>
        </div>

        <MobileSideMenu />
        <Footer />
      </div>
      )
    }

    if (this.state.isDeclineSelected) {
      return (
  <div>
    <Header />

    <div class="wrapper clearfix">
      <SideMenu />
      <div class="decline-reason">
      <h2>Decline Request</h2>
      <div class="form-section first">
        <p>Thank you for your response.<br/>Please select reason you decline the offer.</p>

        <select onChange={this.selectDeclineReason} value={this.state.decline_reason}>
          <option value="1">The proposed price is not enough</option>
          <option value="2">The commission fee is not enough</option>
          <option value="3">The item is too big/heavy</option>
          <option value="4">The item is hard to get</option>
          <option value="0">Other</option>
        </select>
        <input class="decline-comment" type="text" maxlength="200" placeholder="Comment to share with the reason"
          value={this.state.decline_reason_comment} onChange={(e) => this.setState({decline_reason_comment: e.target.value})} />
        <div class="action-area"><button class="btn decline" onClick={this.declineItemRequest}>Decline</button></div>
      </div>
    </div>
    </div>

    <MobileSideMenu />
    <Footer />
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
         <p class="bread-crumb"><a href="/transaction/status">←Back to Transaction List</a></p>
         {/* This use is requester */
         is_requester && (
           <div>
             <h2>Sent Request</h2>
             <div class="history-summary">
             <h3>Transaction History with {requestHistory.respondent.first_name}</h3>
             <ul>
               <li>Request you sent</li>
               <li> Item Name:  {requestHistory.item_name}</li>
               <li>Number of Item(s):  {requestHistory.n_items}</li>
               <li>Price    :  ${requestHistory.proposed_price.toLocaleString()}</li>
             </ul>
           </div>
           </div>
         )}

         {
         /* meetup option decided */
         is_requester && item_request_status === 2 && ( process_status === "item_received" || process_status == "payment_transferred" ) && (
         <div>
           <div class="history-box">
             <div class="history-wrapper">
               <p class="history-date">
                 {requestHistory.item_received_at && moment(requestHistory.item_received_at, "YYYY-MM-DD HH:mm:ss").format("YYYY-MM-DD")}
               </p>
               <p class="notify-heading">You received the item</p>
             </div>
           </div>
           <div class="history-box initial">
             <div class="history-wrapper">
               <p class="history-date">
                 {requestHistory.meetup_decided_at && moment(requestHistory.meetup_decided_at, "YYYY-MM-DD HH:mm:ss").format("YYYY-MM-DD")}
               </p>
               <p class="history-update">Meetup place/time was set</p>
             </div>
             <p class="contact-info">Meetup Details</p>
             <ul class="request-data">
               <li>DATE   : {requestHistory.purchase_notification[0].final_meetup.date}</li>
               <li>TIME   : {requestHistory.purchase_notification[0].final_meetup.dtime}</li>
               <li>ADDRESS: {requestHistory.purchase_notification[0].final_meetup.address}</li>
               <li>NOTE   : {requestHistory.purchase_notification[0].final_meetup.comment}</li>
             </ul>
             <p class="contact-info">Contact Info of {requestHistory.respondent.first_name}</p>
             <ul>
              <li>PHONE: {requestHistory.purchase_notification[0].preferred_phone} </li>
              <li>E-MAIL: {requestHistory.purchase_notification[0].preferred_email} </li>
            </ul>
           </div>
         </div>
         )}

         {
         /* meetup option decided */
         is_requester && item_request_status === 2 && process_status === "meetup_decided" && (
         <div>
           Please let us know if the traveler did not show up to the decided meetup or you have a trouble receiving the item.
           <Link to={{
             pathname: "/contact-us",
           }}>
             <button class="btn accept">Report</button>
           </Link>

           <div class="history-box">
             <div class="history-wrapper">
               <p class="history-date new-update">NEW!</p>
               <p class="notify-heading">Confirm your item receipt</p>
               <ul>
                <li>Report Torimo if there were any problems. You cannot undo once item receipt is confirmed! </li>
              </ul>
               <div class="action-area received">
                 <button class="btn accept" onClick={this.receiveItem}>Confirm Receipt</button>
                 <Link to={{
                   pathname: "/contact-us",
                 }}>
                 <button class="btn decline">Report Torimo</button>
                 </Link>
               </div>
             </div>

           </div>
           <div class="history-box initial">
             <div class="history-wrapper">
               <p class="history-date">
                 {requestHistory.meetup_decided_at && moment(requestHistory.meetup_decided_at, "YYYY-MM-DD HH:mm:ss").format("YYYY-MM-DD")}
               </p>
               <p class="history-update">Meetup place/time is set! Meet and receive your item</p>
             </div>
             <p class="contact-info">Meetup Details</p>
             <ul class="request-data">
               <li>DATE   : {requestHistory.purchase_notification[0].final_meetup.date}</li>
               <li>TIME   : {requestHistory.purchase_notification[0].final_meetup.dtime}</li>
               <li>ADDRESS: {requestHistory.purchase_notification[0].final_meetup.address}</li>
               <li>NOTE   : {requestHistory.purchase_notification[0].final_meetup.comment}</li>
             </ul>
             <p class="contact-info">Contact Info of {requestHistory.respondent.first_name}</p>
             <ul>
              <li>PHONE: {requestHistory.purchase_notification[0].preferred_phone} </li>
              <li>E-MAIL: {requestHistory.purchase_notification[0].preferred_email} </li>
            </ul>
           </div>
         </div>
         )}

         {
         /* meetup option suggested by this requester */
         is_requester && item_request_status === 2 &&
         process_status === "meetup_suggested" && requestHistory.purchase_notification[0].action_taken_by === 1 && (
           <div class="history-box meetups">
             <div class="history-wrapper">
               <p class="history-date">
                 {requestHistory.meetup_suggested_at && moment(requestHistory.meetup_suggested_at, "YYYY-MM-DD HH:mm:ss").format("YYYY-MM-DD")}
               </p>
               <p class="history-update"><span class="suggested-option">You suggested following meetup options</span></p>
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
                   <li>Comment:{requestHistory.purchase_notification[0].meetup_option1.comment}</li>
                 </ul>
               </li>

               <li>Meetup option2:</li>
               <li>
                 <ul class="request-data">
                   <li>Date   :{requestHistory.purchase_notification[0].meetup_option2.date}</li>
                   <li>Time   :{requestHistory.purchase_notification[0].meetup_option2.dtime}</li>
                   <li>Address:{requestHistory.purchase_notification[0].meetup_option2.address}</li>
                   <li>Comment:{requestHistory.purchase_notification[0].meetup_option2.comment}</li>
                 </ul>
               </li>

               <li>Meetup option3:</li>
               <li>
                 <ul class="request-data">
                   <li>Date   :{requestHistory.purchase_notification[0].meetup_option3.date}</li>
                   <li>Time   :{requestHistory.purchase_notification[0].meetup_option3.dtime}</li>
                   <li>Address:{requestHistory.purchase_notification[0].meetup_option3.address}</li>
                   <li>Comment:{requestHistory.purchase_notification[0].meetup_option3.comment}</li>
                 </ul>
               </li>
             </ul>
           </div>
         )}
         {
         /* meetup option suggested by traveler */
         is_requester && item_request_status === 2 &&
         process_status === "meetup_suggested" && requestHistory.purchase_notification[0].action_taken_by === 0 && (
           <div class="history-box meetups">
             <div class="history-wrapper">
               <p class="history-date">
                 {requestHistory.purchase_notified_at && moment(requestHistory.purchase_notified_at, "YYYY-MM-DD HH:mm:ss").format("YYYY-MM-DD")}
               </p>
               <p class="history-update">{requestHistory.respondent.first_name} purchased the item you requested! Let's decide on meetup details</p>
             </div>
             <ul class="request-data">
               <li>Phone number: {requestHistory.purchase_notification[0].preferred_phone} </li>
               <li>Email address: {requestHistory.purchase_notification[0].preferred_email} </li>
            </ul>
            <div class="meetup-option-select">
               <p>Meetup option1:</p>
                   <ul class="request-data">
                     <li>Date   :{requestHistory.purchase_notification[0].meetup_option1.date}</li>
                     <li>Time   :{requestHistory.purchase_notification[0].meetup_option1.dtime}</li>
                     <li>Address:{requestHistory.purchase_notification[0].meetup_option1.address}</li>
                     <li>Comment:{requestHistory.purchase_notification[0].meetup_option1.comment}</li>
                   </ul>
                 <Link to={{
                     pathname: "/share/contact",
                     state: {
                       purchase_notification: requestHistory.purchase_notification[0],
                       meetup: requestHistory.purchase_notification[0].meetup_option1,
                       action_taken_by: 1,
                     }
                   }}>
                   <button class="btn accept-meetup">Accept</button>
                 </Link>
               </div>

               <div class="meetup-option-select">
                 <p>Meetup option2:</p>
                   <ul class="request-data">
                     <li>Date   :{requestHistory.purchase_notification[0].meetup_option2.date}</li>
                     <li>Time   :{requestHistory.purchase_notification[0].meetup_option2.dtime}</li>
                     <li>Address:{requestHistory.purchase_notification[0].meetup_option2.address}</li>
                     <li>Comment:{requestHistory.purchase_notification[0].meetup_option2.comment}</li>
                   </ul>
                 <Link to={{
                     pathname: "/share/contact",
                     state: {
                       purchase_notification: requestHistory.purchase_notification[0],
                       meetup: requestHistory.purchase_notification[0].meetup_option2,
                       action_taken_by: 1,
                     }
                   }}>
                   <button class="btn accept-meetup">Accept</button>
                 </Link>
                 </div>

                 <div class="meetup-option-select">
                 <p>Meetup option3:</p>
                   <ul class="request-data">
                     <li>Date   :{requestHistory.purchase_notification[0].meetup_option3.date}</li>
                     <li>Time   :{requestHistory.purchase_notification[0].meetup_option3.dtime}</li>
                     <li>Address:{requestHistory.purchase_notification[0].meetup_option3.address}</li>
                     <li>Comment:{requestHistory.purchase_notification[0].meetup_option3.comment}</li>
                   </ul>

                 <Link to={{
                     pathname: "/share/contact",
                     state: {
                       purchase_notification: requestHistory.purchase_notification[0],
                       meetup: requestHistory.purchase_notification[0].meetup_option3,
                       action_taken_by: 1,
                     }
                   }}>
                   <button class="btn accept-meetup">Accept</button>
                 </Link>
                 </div>


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
               <p class="history-date">
                 {requestHistory.purchase_notified_at && moment(requestHistory.purchase_notified_at, "YYYY-MM-DD HH:mm:ss").format("YYYY-MM-DD")}
               </p>
               <p class="history-update">{requestHistory.respondent.first_name} purchased the item you requested! Let's decide on meetup details</p>
             </div>
             <ul class="request-data">
               <li>Phone number: {requestHistory.purchase_notification[0].preferred_phone} </li>
               <li>Email address: {requestHistory.purchase_notification[0].preferred_email} </li>
             </ul>
             <div class="meetup-option-select">
               <p>Meetup option1:</p>
                 <ul class="request-data">
                   <li>Date   :{requestHistory.purchase_notification[0].meetup_option1.date}</li>
                   <li>Time   :{requestHistory.purchase_notification[0].meetup_option1.dtime}</li>
                   <li>Address:{requestHistory.purchase_notification[0].meetup_option1.address}</li>
                   <li>Comment:{requestHistory.purchase_notification[0].meetup_option1.comment}</li>
                 </ul>
               <Link to={{
                   pathname: "/share/contact",
                   state: {
                     purchase_notification: requestHistory.purchase_notification[0],
                     meetup: requestHistory.purchase_notification[0].meetup_option1,
                     action_taken_by: 1,
                   }
                 }}>
                 <button class="btn accept-meetup">Accept</button>
               </Link>
               </div>

               <div class="meetup-option-select">
               <p>Meetup option2:</p>
                 <ul class="request-data">
                   <li>Date   :{requestHistory.purchase_notification[0].meetup_option2.date}</li>
                   <li>Time   :{requestHistory.purchase_notification[0].meetup_option2.dtime}</li>
                   <li>Address:{requestHistory.purchase_notification[0].meetup_option2.address}</li>
                   <li>Comment:{requestHistory.purchase_notification[0].meetup_option2.comment}</li>
                 </ul>
               <Link to={{
                   pathname: "/share/contact",
                   state: {
                     purchase_notification: requestHistory.purchase_notification[0],
                     meetup: requestHistory.purchase_notification[0].meetup_option2,
                     action_taken_by: 1,
                   }
                 }}>
                 <button class="btn accept-meetup">Accept</button>
               </Link>
               </div>

               <div class="meetup-option-select">
               <p>Meetup option3:</p>
                 <ul class="request-data">
                   <li>Date   :{requestHistory.purchase_notification[0].meetup_option3.date}</li>
                   <li>Time   :{requestHistory.purchase_notification[0].meetup_option3.dtime}</li>
                   <li>Address:{requestHistory.purchase_notification[0].meetup_option3.address}</li>
                   <li>Comment:{requestHistory.purchase_notification[0].meetup_option3.comment}</li>
                 </ul>
               <Link to={{
                   pathname: "/share/contact",
                   state: {
                     purchase_notification: requestHistory.purchase_notification[0],
                     meetup: requestHistory.purchase_notification[0].meetup_option3,
                     action_taken_by: 1,
                   }
                 }}>
                 <button class="btn accept-meetup">Accept</button>
               </Link>
               </div>
            <div class="btn suggest">
             <Link to={{
                   pathname: "/request/meetup/form",
                   state: {
                     requests: requestHistory,
                     action_taken_by: 1,
                   }
                 }}>Or Suggest Other Options
             </Link>
             </div>
           </div>
         )}

         {/* the requester made payment so the traveler notify the purchase */
         is_requester && process_status === "payment_made" && (
         <div>
          <p class="report-content">
           Let us know if no purchase notification is made by {requestHistory.trip.arrival_date}
           </p>
           <Link to={{
               pathname: "/contact-us",
             }}>
             <button class="btn report">Report Torimo</button>
           </Link>

           <div class="history-box">
             <div class="history-wrapper">
             <p class="history-date new-update">NEW!</p>
               <p class="notify-heading">Waiting purchase notification from {requestHistory.respondent.first_name}</p>
             </div>
           </div>
         </div>
         )}

         {/* the requester made payment */
         is_requester && requestHistory.paid_at && (
           <div class="history-box">
             <div class="history-wrapper">
               <p class="history-date">
                 {requestHistory.paid_at && moment(requestHistory.paid_at, "YYYY-MM-DD HH:mm:ss").format("YYYY-MM-DD")}
               </p>
               <p class="history-update">You completed payment</p>
             </div>
           </div>
         )}

         {/* the user doesn't pay yet */
         is_requester && item_request_status === 2 && process_status === "request_responded" && (
           <div class="history-box initial">
             <div class="history-wrapper">
               <p class="history-date new-update">NEW!</p>
               <p class="history-update">Payment Detail</p>
               <ul class="request-data">
                 <li>Item Price:   ${requestHistory.proposed_price}</li>
                 <li>Commission Fee:   ${requestHistory.commission_fee}</li>
                 <li>Transaction Fee (3% of the proposed price):   ${requestHistory.transaction_fee}</li>
                 <br/>
                 <li>
                 Your Total Payment: ${requestHistory.transaction_fee + requestHistory.commission_fee + requestHistory.proposed_price}
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
               <p class="history-date new-update">NEW!</p>
               <p class="history-update">Waiting response from {requestHistory.respondent.first_name}</p>
             </div>
           </div>
         )}
         {/* the traveler rejected */
         is_requester && item_request_status === 3 && (
           <div class="history-box initial">
             <div class="history-wrapper">
               <p class="history-date">
                 {requestHistory.responded_at && moment(requestHistory.responded_at, "YYYY-MM-DD HH:mm:ss").format("YYYY-MM-DD")}
               </p>
               <p class="history-update">Your request was rejected by {requestHistory.respondent.first_name}</p>
               <ul>
               <li>
                  {requestHistory.decline_reason === 1 && ("Reason: The proposed price is not enough")}
                  {requestHistory.decline_reason === 2 && ("Reason: The commission fee is not enough")}
                  {requestHistory.decline_reason === 3 && ("Reason: The item is too big/heavy")}
                  {requestHistory.decline_reason === 4 && ("Reason: The item is hard to get")}
               </li>
               <li>
                  {requestHistory.decline_reason_comment !== "" && (requestHistory.decline_reason_comment)}
               </li>
               </ul>
             </div>
           </div>
         )}
         {/* the traveler accepted */
         is_requester && item_request_status === 2 && (
           <div class="history-box">
             <div class="history-wrapper">
               <p class="history-date">
                 {requestHistory.responded_at && moment(requestHistory.responded_at, "YYYY-MM-DD HH:mm:ss").format("YYYY-MM-DD")}
               </p>
               <p class="history-update">Your request was accepted by {requestHistory.respondent.first_name}</p>
             </div>
           </div>
         )}
         {/*the request was cancelled*/
         is_requester && item_request_status === 1 && (
           <div class="history-box">
             <div class="history-wrapper">
               <p class="history-date">
                 {requestHistory.responded_at && moment(requestHistory.responded_at, "YYYY-MM-DD HH:mm:ss").format("YYYY-MM-DD")}
               </p>
               <p class="history-update">You cancelled the request</p>
             </div>
           </div>
         )}
         {/*the request was cancelled*/
         is_requester && item_request_status === 4 && (
           <div class="history-box">
             <div class="history-wrapper">
               <p class="history-date">
                 {requestHistory.responded_at && moment(requestHistory.responded_at, "YYYY-MM-DD HH:mm:ss").format("YYYY-MM-DD")}
               </p>
               <p class="history-update">{requestHistory.respondent.first_name} cancelled the request</p>
             </div>
           </div>
         )}

         {/* This use is traveler */
         is_traveler && (
           <div>
           <h2>Received Request</h2>
           <div class="history-summary">
             <h3>Transaction History with {requestHistory.requester.first_name}</h3>
             <ul>
               <li>Request {requestHistory.requester.first_name} sent</li>
               <li>Item Name:  {requestHistory.item_name}</li>
               <li>Price    :  ${requestHistory.proposed_price.toLocaleString()}</li>
              </ul>
           </div>
           </div>
         )}

          {/*the traveler rejected the request*/
         is_traveler && item_request_status === 3 && (
           <div class="history-box initial">
             <div class="history-wrapper">
               <p class="history-date">
                 {requestHistory.responded_at && moment(requestHistory.responded_at, "YYYY-MM-DD HH:mm:ss").format("YYYY-MM-DD")}
               </p>
               <p class="history-update">You rejected the request</p>
               <ul>
               <li>
                  {requestHistory.decline_reason === 1 && ("Reason: The proposed price is not enough")}
                  {requestHistory.decline_reason === 2 && ("Reason: The commission fee is not enough")}
                  {requestHistory.decline_reason === 3 && ("Reason: The item is too big/heavy")}
                  {requestHistory.decline_reason === 4 && ("Reason: The item is hard to get")}
               </li>
               <li>
                  {requestHistory.decline_reason_comment !== "" && (requestHistory.decline_reason_comment)}
               </li>
               </ul>
             </div>
           </div>
         )}

         {/*the request was cancelled*/
         is_traveler && item_request_status === 1 && (
           <div class="history-box">
             <div class="history-wrapper">
               <p class="history-date">
                 {requestHistory.responded_at && moment(requestHistory.responded_at, "YYYY-MM-DD HH:mm:ss").format("YYYY-MM-DD")}
               </p>
               <p class="history-update">The request was cancelled</p>
             </div>
           </div>
         )}

         {/*the request was cancelled*/
         is_traveler && item_request_status === 4 && (
           <div class="history-box">
             <div class="history-wrapper">
               <p class="history-date">
                 {requestHistory.responded_at && moment(requestHistory.responded_at, "YYYY-MM-DD HH:mm:ss").format("YYYY-MM-DD")}
               </p>
               <p class="history-update">You cancelled the request</p>
             </div>
           </div>
         )}

         {
         /* meetup option decided */
         is_traveler && item_request_status === 2 && process_status === "payment_transferred" && (
         <div>
           <div class="history-box">
             <div class="history-wrapper">
               <p class="history-date">
                 {requestHistory.payment_transferred_at && moment(requestHistory.payment_transferred_at, "YYYY-MM-DD HH:mm:ss").format("YYYY-MM-DD")}
               </p>
               <p class="notify-heading">The payment was transferred to your Stripe account</p>
             </div>
           </div>
           <div class="history-box">
             <div class="history-wrapper">
               <p class="history-date">
                 {requestHistory.item_received_at && moment(requestHistory.item_received_at, "YYYY-MM-DD HH:mm:ss").format("YYYY-MM-DD")}
               </p>
               <p class="notify-heading">{requestHistory.requester.first_name} received the item</p>
             </div>
           </div>
           <div class="history-box initial">
             <p class="history-date">
               {requestHistory.meetup_decided_at && moment(requestHistory.meetup_decided_at, "YYYY-MM-DD HH:mm:ss").format("YYYY-MM-DD")}
             </p>
               <p class="history-update">Meetup place/time was set</p>
                <p class="contact-info">Meetup Details</p>
             <ul class="request-data">
               <li>DATE   : {requestHistory.purchase_notification[0].final_meetup.date}</li>
               <li>TIME   : {requestHistory.purchase_notification[0].final_meetup.dtime}</li>
               <li>ADDRESS: {requestHistory.purchase_notification[0].final_meetup.address}</li>
               <li>NOTE   : {requestHistory.purchase_notification[0].final_meetup.comment}</li>
             </ul>
             <p class="contact-info">Contact Info of {requestHistory.requester.first_name}</p>
             <ul>
               <li>PHONE: {requestHistory.purchase_notification[0].shared_contact[0].preferred_phone} </li>
               <li>E-MAIL: {requestHistory.purchase_notification[0].shared_contact[0].preferred_email} </li>
             </ul>
           </div>
         </div>
         )}

         {
         /* meetup option decided */
         is_traveler && item_request_status === 2 && process_status === "item_received" && (
         <div>
           <div class="history-box">
             <div class="history-wrapper">
               <p class="history-date new-update">NEW!</p>
               <p class="history-update">Let's get paid!</p>
               <Link to={{
                 pathname: `/connect/stripe/${this.props.match.params.requestId}`,
                 state: {
                   requests: this.state.requests,
                 }
               }} class="btn notify">Proceed
               </Link>
             </div>
           </div>
           <div class="history-box">
             <div class="history-wrapper">
               <p class="history-date">
                 {requestHistory.item_received_at && moment(requestHistory.item_received_at, "YYYY-MM-DD HH:mm:ss").format("YYYY-MM-DD")}
               </p>
               <p class="notify-heading">{requestHistory.requester.first_name} received the item</p>
             </div>
           </div>
           <div class="history-box initial">
             <p class="history-date">
               {requestHistory.meetup_decided_at && moment(requestHistory.meetup_decided_at, "YYYY-MM-DD HH:mm:ss").format("YYYY-MM-DD")}
             </p>
               <p class="history-update">Meetup place/time was set</p>
                <p class="contact-info">Meetup Details</p>
             <ul class="request-data">
               <li>DATE   : {requestHistory.purchase_notification[0].final_meetup.date}</li>
               <li>TIME   : {requestHistory.purchase_notification[0].final_meetup.dtime}</li>
               <li>ADDRESS: {requestHistory.purchase_notification[0].final_meetup.address}</li>
               <li>NOTE   : {requestHistory.purchase_notification[0].final_meetup.comment}</li>
             </ul>
             <p class="contact-info">Contact Info of {requestHistory.requester.first_name}</p>
             <ul>
               <li>PHONE: {requestHistory.purchase_notification[0].shared_contact[0].preferred_phone} </li>
               <li>E-MAIL: {requestHistory.purchase_notification[0].shared_contact[0].preferred_email} </li>
             </ul>
           </div>
         </div>
         )}

         {
         /* meetup option decided */
         is_traveler && item_request_status === 2 && process_status === "meetup_decided" && (
           <div class="history-box initial">
             <p class="history-date">
               {requestHistory.meetup_decided_at && moment(requestHistory.meetup_decided_at, "YYYY-MM-DD HH:mm:ss").format("YYYY-MM-DD")}
             </p>
               <p class="history-update">Meetup place/time is set! Meet and deliver the item</p>
                <p class="contact-info">Meetup Details</p>
             <ul class="request-data">
               <li>DATE   : {requestHistory.purchase_notification[0].final_meetup.date}</li>
               <li>TIME   : {requestHistory.purchase_notification[0].final_meetup.dtime}</li>
               <li>ADDRESS: {requestHistory.purchase_notification[0].final_meetup.address}</li>
               <li>NOTE   : {requestHistory.purchase_notification[0].final_meetup.comment}</li>
             </ul>
             <p class="contact-info">Contact Info of {requestHistory.requester.first_name}</p>
             <ul>
               <li>PHONE: {requestHistory.purchase_notification[0].shared_contact[0].preferred_phone} </li>
               <li>E-MAIL: {requestHistory.purchase_notification[0].shared_contact[0].preferred_email} </li>
             </ul>
           </div>
         )}

         {
         /* meetup option suggested by this traveler */
         is_traveler && item_request_status === 2 &&
         process_status === "meetup_suggested" && requestHistory.purchase_notification[0].action_taken_by === 0 && (
           <div class="history-box meetups">
             <p class="history-date">
               {requestHistory.meetup_suggested_at && moment(requestHistory.meetup_suggested_at, "YYYY-MM-DD HH:mm:ss").format("YYYY-MM-DD")}
             </p>
             <div class="history-wrapper">
               <p class="history-update"><span class="suggested-option">You suggested following meetup options</span></p>
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
                   <li>Comment:{requestHistory.purchase_notification[0].meetup_option1.comment}</li>
                 </ul>
               </li>

               <li>Meetup option2:</li>
               <li>
                 <ul class="request-data">
                   <li>Date   :{requestHistory.purchase_notification[0].meetup_option2.date}</li>
                   <li>Time   :{requestHistory.purchase_notification[0].meetup_option2.dtime}</li>
                   <li>Address:{requestHistory.purchase_notification[0].meetup_option2.address}</li>
                   <li>Comment:{requestHistory.purchase_notification[0].meetup_option2.comment}</li>
                 </ul>
               </li>

               <li>Meetup option3:</li>
               <li>
                 <ul class="request-data">
                   <li>Date   :{requestHistory.purchase_notification[0].meetup_option3.date}</li>
                   <li>Time   :{requestHistory.purchase_notification[0].meetup_option3.dtime}</li>
                   <li>Address:{requestHistory.purchase_notification[0].meetup_option3.address}</li>
                   <li>Comment:{requestHistory.purchase_notification[0].meetup_option3.comment}</li>
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
               <p class="history-date">
                 {requestHistory.purchase_notified_at && moment(requestHistory.purchase_notified_at, "YYYY-MM-DD HH:mm:ss").format("YYYY-MM-DD")}
               </p>
               <p class="history-update">You purchased the requested item </p>
             </div>
             <ul class="request-data">
               <li><span class="suggested-option">You shared the following information</span></li>
               <li>Phone number: {requestHistory.purchase_notification[0].preferred_phone} </li>
               <li>Email address: {requestHistory.purchase_notification[0].preferred_email} </li>
               <br/>

               <li><span class="suggested-option">You suggested following meetup options</span></li>
               <li>Meetup option1:</li>
               <li>
                 <ul class="request-data">
                   <li>Date   :{requestHistory.purchase_notification[0].meetup_option1.date}</li>
                   <li>Time   :{requestHistory.purchase_notification[0].meetup_option1.dtime}</li>
                   <li>Address:{requestHistory.purchase_notification[0].meetup_option1.address}</li>
                   <li>Comment:{requestHistory.purchase_notification[0].meetup_option1.comment}</li>
                 </ul>
               </li>

               <li>Meetup option2:</li>
               <li>
                 <ul class="request-data">
                   <li>Date   :{requestHistory.purchase_notification[0].meetup_option2.date}</li>
                   <li>Time   :{requestHistory.purchase_notification[0].meetup_option2.dtime}</li>
                   <li>Address:{requestHistory.purchase_notification[0].meetup_option2.address}</li>
                   <li>Comment:{requestHistory.purchase_notification[0].meetup_option2.comment}</li>
                 </ul>
               </li>

               <li>Meetup option3:</li>
               <li>
                 <ul class="request-data">
                   <li>Date   :{requestHistory.purchase_notification[0].meetup_option3.date}</li>
                   <li>Time   :{requestHistory.purchase_notification[0].meetup_option3.dtime}</li>
                   <li>Address:{requestHistory.purchase_notification[0].meetup_option3.address}</li>
                   <li>Comment:{requestHistory.purchase_notification[0].meetup_option3.comment}</li>
                 </ul>
               </li>
             </ul>
           </div>
         )}

         {
         /* meetup option suggested by requester */
         is_traveler && item_request_status === 2 &&
         process_status === "meetup_suggested" && requestHistory.purchase_notification[0].action_taken_by === 1 && (
           <div class="history-box meetups">
             <p class="history-date">
               {requestHistory.meetup_suggested_at && moment(requestHistory.meetup_suggested_at, "YYYY-MM-DD HH:mm:ss").format("YYYY-MM-DD")}
             </p>

             <p class="history-update">{requestHistory.requester.first_name} proposed new meetup options </p>
             <div class="history-wrapper">
             </div>
             <ul class="request-data">
               <li>Phone number: {requestHistory.purchase_notification[0].preferred_phone} </li>
               <li>Email address: {requestHistory.purchase_notification[0].preferred_email} </li>
             </ul>
               <div class="meetup-option-select">
               <p>Meetup option1:</p>
                 <ul class="request-data">
                   <li>Date   :{requestHistory.purchase_notification[0].meetup_option1.date}</li>
                   <li>Time   :{requestHistory.purchase_notification[0].meetup_option1.dtime}</li>
                   <li>Address:{requestHistory.purchase_notification[0].meetup_option1.address}</li>
                   <li>Comment:{requestHistory.purchase_notification[0].meetup_option1.comment}</li>
                 </ul>
               <Link to={{
                   pathname: "/share/contact",
                   state: {
                     purchase_notification: requestHistory.purchase_notification[0],
                     meetup: requestHistory.purchase_notification[0].meetup_option1,
                     action_taken_by: 0,
                   }
                 }}>
                 <button class="btn accept-meetup">Accept</button>
               </Link>
               </div>

               <div class="meetup-option-select">
               <p>Meetup option2:</p>
                 <ul class="request-data">
                   <li>Date   :{requestHistory.purchase_notification[0].meetup_option2.date}</li>
                   <li>Time   :{requestHistory.purchase_notification[0].meetup_option2.dtime}</li>
                   <li>Address:{requestHistory.purchase_notification[0].meetup_option2.address}</li>
                   <li>Comment:{requestHistory.purchase_notification[0].meetup_option2.comment}</li>
                 </ul>
               <Link to={{
                   pathname: "/share/contact",
                   state: {
                     purchase_notification: requestHistory.purchase_notification[0],
                     meetup: requestHistory.purchase_notification[0].meetup_option2,
                     action_taken_by: 0,
                   }
                 }}>
                 <button class="btn accept-meetup">Accept</button>
               </Link>
               </div>

               <div class="meetup-option-select">
               <p>Meetup option3:</p>
                 <ul class="request-data">
                   <li>Date   :{requestHistory.purchase_notification[0].meetup_option3.date}</li>
                   <li>Time   :{requestHistory.purchase_notification[0].meetup_option3.dtime}</li>
                   <li>Address:{requestHistory.purchase_notification[0].meetup_option3.address}</li>
                   <li>Comment:{requestHistory.purchase_notification[0].meetup_option3.comment}</li>
                 </ul>
               <Link to={{
                   pathname: "/share/contact",
                   state: {
                     purchase_notification: requestHistory.purchase_notification[0],
                     meetup: requestHistory.purchase_notification[0].meetup_option3,
                     action_taken_by: 0,
                   }
                 }}>
                 <button class="btn accept-meetup">Accept</button>
               </Link>
               </div>

               <div class="btn suggest">
             <Link to={{
                   pathname: "/request/meetup/form",
                   state: {
                     requests: requestHistory,
                     action_taken_by: 0,
                   }
                 }}>Suggest other meetup options
             </Link>
           </div>
           </div>
         )}

         {/* the traveler accepted request but payment is not made yet */
         is_traveler && item_request_status === 2 && process_status === "request_responded" && (
         <div>
           <div class="history-box">
             <div class="history-wrapper">
              <p class="history-date new-update">NEW!</p>
               <p class="history-update">Waiting payment by {requestHistory.respondent.first_name}</p>
             </div>
           </div>
         </div>
         )}

         {/* the requester made payment so the traveler notify the purchase */
         is_traveler && process_status === "payment_made" && (
         <div>
           <div class="history-box">
             <div class="history-wrapper">
             <p class="history-date new-update">NEW!</p>
               <p class="notify-heading">Notify that you purchased the item</p>
               <Link to={{
                 pathname: `/notification/purchase/form/${this.props.match.params.requestId}`,
                 state: {
                   requests: this.state.requests,
                 }
               }} class="btn notify">Notify
               </Link>
             </div>
           </div>
         </div>
         )}

         {/* the requester made payment */
         is_traveler && requestHistory.paid_at && (
           <div class="history-box">
             <div class="history-wrapper">
               <p class="history-date">
                 {requestHistory.paid_at && moment(requestHistory.paid_at, "YYYY-MM-DD HH:mm:ss").format("YYYY-MM-DD")}
               </p>
               <p class="history-update">Payment completed by {requestHistory.respondent.first_name}</p>
             </div>
           </div>
         )}


         {/*the traveler accepted the request*/
         is_traveler && item_request_status === 2 && (
           <div class="history-box">
             <div class="history-wrapper">
               <p class="history-date">
                 {requestHistory.responded_at && moment(requestHistory.responded_at, "YYYY-MM-DD HH:mm:ss").format("YYYY-MM-DD")}
               </p>
               <p class="history-update">You accepted the request</p>
             </div>
           </div>
         )}


         <div class="history-box">
           <p class="history-date">
             {requestHistory.created_at && moment(requestHistory.created_at, "YYYY-MM-DD HH:mm:ss").format("YYYY-MM-DD")}
           </p>
           {is_requester ? (
             <p class="history-update">Request sent by You</p>
           ) : (
             <p class="history-update">Request sent by {requestHistory.requester.first_name}</p>
           )}

           <ul class="request-data">
             {is_traveler ? (
               <li>User Name:   You</li>
             ) : (
               <li>User Name:   {requestHistory.respondent.first_name}</li>
             )}
             <li>Location:   {requestHistory.trip.destination}</li>
             <li>Item Name:  {requestHistory.item_name}</li>
             <li>Item URL (Optional):   {requestHistory.item_url}</li>
             {requestHistory.item_image && (
               <img src={`https://${keys.AWS_BUCKET}.s3-us-west-2.amazonaws.com/requests/${requestHistory.id}/${requestHistory.item_image}`} />
             )}
             <li>Number of Item(s):   {requestHistory.n_items}</li>
             <li>Item Price:  ${requestHistory.proposed_price.toLocaleString()}</li>
             <li>Your Commission Fee:   ${requestHistory.commission_fee.toLocaleString()}</li>
             {is_requester && ( <li>Transaction Fee:   {requestHistory.transaction_fee.toLocaleString()}</li>)}
             {is_requester && (
               <li>
                 Total Payment: {(requestHistory.transaction_fee + requestHistory.commission_fee + requestHistory.proposed_price).toLocaleString()}
               </li>
             )}
             <li>Delivery Method:   Meetup</li>
             <li>Preferred meetup location: {requestHistory.preferred_meetup_location}</li>
             <li>Preferred meetup date/time: {requestHistory.preferred_meetup_date}</li>
             <li>Comments (Optional): {requestHistory.comment}</li>
           </ul>
           {is_traveler  && requestHistory.status === 0 && (
             <div class="request-action">
              <ul class="warning">
                <li>Important notes:</li>
                <li>As Traveler, you are responsible for the items you bring with you.</li>
                <li>DO NOT buy at locations that are contrary to the instruction of Requester, and only buy in reputable stores.</li>
              </ul>
              <div class="action-area">
               <button class="btn accept" onClick={this.acceptItemRequest}>Accept</button>
               <button class="btn decline" onClick={this.selectDeclineItemRequest}>Decline</button>
              </div>
             </div>
           )}
           {is_requester  && requestHistory.status === 0 && (
             <div class="action-area">
               <button class="btn decline" onClick={this.cancelItemRequest}>Cancel Request</button>
             </div>
           )}
         </div>

         {is_traveler && requestHistory.status === 2 &&
           (process_status === "request_responded" || process_status === "payment_made") && (
             <div class="action-area">
               <button class="btn decline" onClick={this.cancelItemRequestbyTraveler}>Cancel Request</button>
             </div>
         )}
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
    isNotFound: state.requests.isNotFound,
    isResponded: state.requests.isResponded,
    isPaymentCompleted: state.requests.isPaymentCompleted,
    isItemReceived: state.requests.isItemReceived,
    isCancelled: state.requests.isCancelled,
    requests: state.requests,
    user: state.auth.user,
  }
}


const mapDispatchToProps = dispatch => {
  return {
    fetchRequestHistory: (requestId) => {
      dispatch(requests.fetchRequestHistory(requestId));
    },
     updateItemRequest: (requestId, item_request, action_type = null) => {
      return dispatch(requests.updateItemRequest(requestId, item_request, action_type));
    },
    chargeItemRequest: (itemRequestId, userId, body, addresses, amount) => {
      return dispatch(requests.chargeItemRequest(itemRequestId, userId, body, addresses, amount));
    },
    logout: () => dispatch(auth.logout()),
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(TransactionHistory);
