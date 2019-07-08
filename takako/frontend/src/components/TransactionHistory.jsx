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
      has_history = true;
      if (this.props.user.id === this.props.requests.requestHistory.requester.id){
        is_requester = true;
      }

      if (this.props.user.id === this.props.requests.requestHistory.respondent.id){
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
         {/* This use is requester */
         has_history && is_requester && (
           <div>
             <h2>Sent Request</h2>
             <h3>Transaction History with {this.props.requests.requestHistory.respondent.first_name}</h3>
             <p>Request you sent</p>
             <p>Item Name:  {this.props.requests.requestHistory.item_name}</p>
             <p>Price    :  {this.props.requests.requestHistory.proposed_price}</p>
           </div>
         )}
         {
         /* the user already paid */
         has_history && is_requester && item_request_status === 2 && is_charged && (
           <div class="history-box">
             <div class="history-wrapper">
               <p>You paid</p>
             </div>
           </div>
         )}
         {/* the user doesn't pay yet */
         has_history && is_requester && item_request_status === 2 && !is_charged && (
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
         has_history && is_requester && item_request_status === 0 && (
           <div class="history-box">
             <div class="history-wrapper">
               <p>Waiting response by {this.props.requests.requestHistory.respondent.first_name}</p>
             </div>
           </div>
         )}
         {/* the traveler rejected */
         has_history && is_requester && item_request_status === 3 && (
           <div class="history-box">
             <div class="history-wrapper">
               <p>Your request was rejected by {this.props.requests.requestHistory.respondent.first_name}</p>
             </div>
           </div>
         )}

         {/* This use is traveler */
         has_history && is_respondent && (
           <div>
             <h2>Received Request</h2>
             <h3>Transaction History with {this.props.requests.requestHistory.requester.first_name}</h3>
             <p>Request {this.props.requests.requestHistory.requester.first_name} sent</p>
             <p>Item Name:  {this.props.requests.requestHistory.item_name}</p>
             <p>Price    :  {this.props.requests.requestHistory.proposed_price}</p>
           </div>
         )}
         {has_history && is_respondent && item_request_status === 2 && !is_charged && (
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
         {has_history && is_respondent && item_request_status === 2 && is_charged && (
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
         {has_history && is_requester && item_request_status === 3 && (
           <div class="history-box">
             <div class="history-wrapper">
               <p>Your request was rejected by {this.props.requests.requestHistory.respondent.first_name}</p>
             </div>
           </div>
         )}

         {has_history && (
             <div class="history-box initial">
               <div class="history-wrapper">
                 {is_requester ? (
                   <p>Request sent by You</p>
                 ) : (
                   <p>Request sent by {this.props.requests.requestHistory.requester.first_name}</p>
                 )}
               </div>
               <ul class="request-data">
                 {is_respondent ? (
                   <li>User Name:   You</li>
                 ) : (
                   <li>User Name:   {this.props.requests.requestHistory.respondent.first_name}</li>
                 )}
                 <li>Location:   {this.props.requests.requestHistory.trip.destination}</li>
                 <li>Item Name:  {this.props.requests.requestHistory.item_name}</li>
                 <li>Item ID (Optional):   {this.props.requests.requestHistory.item_id}</li>
                 <li>Item URL (Optional):   {this.props.requests.requestHistory.item_url}</li>
                 <li>Proposed Price (item price + commission):   {this.props.requests.requestHistory.proposed_price}</li>
                 <li>Preferred Delivery Method:   Ship</li>
                 <li>Comments (Optional): {this.props.requests.requestHistory.comment}</li>
               </ul>
                 {is_respondent  && this.props.requests.requestHistory.status === 0 && (
                   <div>
                     <button class="action-btn" onClick={this.acceptItemRequest}>Accept</button>
                     <button class="action-btn decline" onClick={this.declineItemRequest}>Decline</button>
                   </div>
                 )}

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
