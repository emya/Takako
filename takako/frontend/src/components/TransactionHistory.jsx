import React, { Component } from 'react';
import {connect} from 'react-redux';
import {requests, auth} from "../actions";
import '../css/style.scss';
import MediaQuery from 'react-responsive';
import { library } from '@fortawesome/fontawesome-svg-core';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faIgloo } from '@fortawesome/free-solid-svg-icons';
import Header from './Header';
import SideMenu from './SideMenu';
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
    this.props.updateItemRequest(this.props.match.params.requestId, {"status": 2});
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
    let is_respondent = false;
    let is_charged = false;
    let item_request_status = 0;
    if (this.props.requests.requestHistory) {
      item_request_status = this.props.requests.requestHistory.status;
      console.log(item_request_status);
      has_history = true;
      if (this.props.user.id == this.props.requests.requestHistory.requester.id){
        is_requester = true;
      }

      if (this.props.user.id == this.props.requests.requestHistory.respondent.id){
        is_respondent = true;
      }

      if (this.props.requests.requestHistory.charge && this.props.requests.requestHistory.charge.length > 0){
        const charge = this.props.requests.requestHistory.charge[0];
        if (charge.status == "succeeded"){
          is_charged = true;
        }

      }
    }
    return (
  <div>
     <Header />

      <div class="wrapper clearfix">
       <SideMenu />

       <div class="transaction-history">
         <p class="bread-crumb"><a href="/transaction/status">Back to Transaction Status</a></p>
         {is_requester ? (
           <h2>Sent Request</h2>
         ) : (
           <h2>Received Request</h2>
         )}

         <h3>Transaction Status</h3>
         <div class="status">(*memo to Emi: after initial request is received) Accept or Decline the request!</div>
         <div class="status">(*memo to Emi: when waiting for the pmt) Souvenir will notify you once the payment is made.</div>
         <div class="status">(*memo to Emi: after pmt is made) Purchase the item and notify Souvenir.
          <button class="action-btn">Notify</button>
         </div>

         <h3>Transaction History</h3>
         {has_history && is_requester && item_request_status == 2 && is_charged && (
           <div class="history-box">
             <div class="history-wrapper">
               <p>You paid</p>
             </div>
           </div>
         )}
         {has_history && is_requester && item_request_status == 2 && !is_charged && (
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
         {has_history && is_requester && item_request_status == 0 && (
           <div class="history-box">
             <div class="history-wrapper">
               <p>Waiting response by {this.props.requests.requestHistory.respondent.username}</p>
             </div>
           </div>
         )}
         {has_history && is_requester && item_request_status == 3 && (
           <div class="history-box">
             <div class="history-wrapper">
               <p>Your request was rejected by {this.props.requests.requestHistory.respondent.username}</p>
             </div>
           </div>
         )}
         {has_history && is_respondent && item_request_status == 2 && (
           <div class="history-box">
             <div class="history-wrapper">
               <p>Request accepted by you</p><p>5/2/2019</p>
             </div>
           </div>
         )}
         {has_history && (
             <div class="history-box initial">
               <div class="history-wrapper">
                 {is_requester ? (
                   <p>Request sent by You</p>
                 ) : (
                   <p>Request sent by {this.props.requests.requestHistory.requester.username}</p>
                 )}
               </div>
               <ul class="request-data">
                 {is_respondent ? (
                   <li>User Name:   You</li>
                 ) : (
                   <li>User Name:   {this.props.requests.requestHistory.respondent.username}</li>
                 )}
                 <li>Location:   {this.props.requests.requestHistory.trip.destination}</li>
                 <li>Item Name:  {this.props.requests.requestHistory.item_name}</li>
                 <li>Item ID (Optional):   {this.props.requests.requestHistory.item_id}</li>
                 <li>Item URL (Optional):   {this.props.requests.requestHistory.item_url}</li>
                 <li>Proposed Price (item price + commission):   {this.props.requests.requestHistory.proposed_price}</li>
                 <li>Preferred Delivery Method:   Ship</li>
                 <li>Comments (Optional): {this.props.requests.requestHistory.comment}</li>
               </ul>
                 {is_respondent  && this.props.requests.requestHistory.status == 0 && (
                   <div>
                     <button class="action-btn" onClick={this.acceptItemRequest}>Accept</button>
                     <button class="action-btn decline" onClick={this.declineItemRequest}>Decline</button>
                   </div>
                 )}

             </div>
         )}

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
