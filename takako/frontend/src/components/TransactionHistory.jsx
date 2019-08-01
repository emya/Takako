import React, { Component } from 'react';
import {connect} from 'react-redux';
import {Link} from "react-router-dom";
import {requests, auth} from "../actions";
import '../css/style.scss';
import Header from './Header';
import SideMenu from './SideMenu';
import MobileSideMenu from './MobileSideMenu';
import Footer from './Footer';
import StripeCheckout from 'react-stripe-checkout';
import { keys } from '../keys.js'


class TransactionHistory extends Component {
  componentDidMount() {
    this.props.fetchRequestHistory(this.props.match.params.requestId);
  }

  state = {
    text: "",
    updateNoteId: null,
  }

  acceptItemRequest = () => {
    this.props.updateItemRequest(this.props.match.params.requestId, {"status": 2, "process_status": "request_responded"});
  }

  declineItemRequest = () => {
    this.props.updateItemRequest(this.props.match.params.requestId, {"status": 3, "process_status": "request_responded"});
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

    this.props.chargeItemRequest(this.props.requests.requestHistory.id, this.props.user.id, body);
  };

  declineItemRequest = () => {
    this.props.updateItemRequest(this.props.match.params.requestId, {"status": 3});
  }

  render() {
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
             <h3>Transaction History with {this.props.requests.requestHistory.respondent.first_name}</h3>
             <p>Request you sent</p>
             <p>Item Name:  {this.props.requests.requestHistory.item_name}</p>
             <p>Price    :  {this.props.requests.requestHistory.proposed_price}</p>
           </div>
         )}
         {
         /* meetup option decided */
         is_requester && item_request_status === 2 && process_status === "meetup_decided" && (
           <div class="history-box">
             <div class="history-wrapper">
               <p>Meetup decided!</p>
             </div>
           </div>

         )}
         {
         /* the traveler already notified */
         is_requester && item_request_status === 2 && process_status === "purchase_notified" && (
           <div class="history-box initial">
             <div class="history-wrapper">
               <p>{this.props.requests.requestHistory.respondent.first_name} purchased the item you requested </p>
             </div>
             <ul class="request-data">
               <li>Phone number: {this.props.requests.requestHistory.purchase_notification[0].preferred_phone} </li>
               <li>Email address: {this.props.requests.requestHistory.purchase_notification[0].preferred_email} </li>
               <li>Meetup option1:</li>
               <li>
                 {this.props.requests.requestHistory.purchase_notification[0].meetup_option1.date}
                 {this.props.requests.requestHistory.purchase_notification[0].meetup_option1.dtime}
                 {this.props.requests.requestHistory.purchase_notification[0].meetup_option1.address}
               </li>
               <Link to={{
                   pathname: "/share/contact",
                   state: {
                     purchase_notification: this.props.requests.requestHistory.purchase_notification[0],
                     meetup: this.props.requests.requestHistory.purchase_notification[0].meetup_option1,
                   }
                 }}>
                 <button class="btn accept">Accept</button>
               </Link>
             </ul>
             <Link to={{
                   pathname: "/request/meetup/form",
                   state: {
                     requests: this.props.requests.requestHistory,
                   }
                 }} style={{color: "black"}}>Suggest other meetup options
             </Link>
           </div>
         )}
         {
         /* the user already paid */
         is_requester && item_request_status === 2 && process_status === "payment_made" && (
           <div class="history-box">
             <div class="history-wrapper">
               <p>You paid</p>
             </div>
           </div>
         )}
         {/* the user doesn't pay yet */
         is_requester && item_request_status === 2 && process_status === "request_responded" && (
           <div class="history-box">
             <div class="history-wrapper">
               <p>Payment </p>

               <StripeCheckout
                 stripeKey={keys.STRIPE_PUBLISHABLE_KEY}
                 token={this.onToken}
               />

             </div>
           </div>
         )}
         {/* the traveler doesn't respond yet */
         is_requester && process_status === "request_sent" && (
           <div class="history-box">
             <div class="history-wrapper">
               <p>Waiting response by {this.props.requests.requestHistory.respondent.first_name}</p>
             </div>
           </div>
         )}
         {/* the traveler rejected */
         is_requester && item_request_status === 3 && (
           <div class="history-box">
             <div class="history-wrapper">
               <p>Your request was rejected by {this.props.requests.requestHistory.respondent.first_name}</p>
             </div>
           </div>
         )}

         {/* This use is traveler */
         is_traveler && (
           <div>
             <h2>Received Request</h2>
             <h3>Transaction History with {this.props.requests.requestHistory.requester.first_name}</h3>
             <p>Request {this.props.requests.requestHistory.requester.first_name} sent</p>
             <p>Item Name:  {this.props.requests.requestHistory.item_name}</p>
             <p>Price    :  {this.props.requests.requestHistory.proposed_price}</p>
           </div>
         )}

         {
         /* meetup option decided */
         is_traveler && item_request_status === 2 && process_status === "meetup_decided" && (
           <div class="history-box">
             <div class="history-wrapper">
               <p>Meetup decided!</p>
             </div>
           </div>

         )}

         {/* the traveler accepted request but payment is not made yet */
         is_traveler && item_request_status === 2 && process_status === "request_responded" && (
         <div>
           <div class="history-box">
             <div class="history-wrapper">
               <p>Waiting payment by {this.props.requests.requestHistory.respondent.first_name}</p>
             </div>
           </div>
           <div class="history-box">
             <div class="history-wrapper">
               <p>You accepted the request </p>
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
           <div class="history-box">
             <div class="history-wrapper">
               <p>Payment completed by {this.props.requests.requestHistory.respondent.first_name}</p>
             </div>
           </div>
           <div class="history-box">
             <div class="history-wrapper">
               <p>You accepted the request </p>
             </div>
           </div>
         </div>
         )}

         {/*the traveler rejected the request*/
         is_traveler && item_request_status === 3 && (
           <div class="history-box">
             <div class="history-wrapper">
               <p>Your request was rejected by {this.props.requests.requestHistory.respondent.first_name}</p>
             </div>
           </div>
         )}

         <div class="history-box initial">
           <div class="history-wrapper">
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
             <li>Item ID (Optional):   {requestHistory.item_id}</li>
             <li>Item URL (Optional):   {requestHistory.item_url}</li>
             <li>Proposed Price (item price + commission):   {requestHistory.proposed_price}</li>
             <li>Preferred Delivery Method:   Ship</li>
             <li>Comments (Optional): {requestHistory.comment}</li>
           </ul>
             {is_traveler  && requestHistory.status === 0 && (
               <div>
                 <button class="action-btn" onClick={this.acceptItemRequest}>Accept</button>
                 <button class="action-btn decline" onClick={this.declineItemRequest}>Decline</button>
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
    chargeItemRequest: (itemRequestId, userId, body) => {
      return dispatch(requests.chargeItemRequest(itemRequestId, userId, body));
    },
    logout: () => dispatch(auth.logout()),
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(TransactionHistory);
