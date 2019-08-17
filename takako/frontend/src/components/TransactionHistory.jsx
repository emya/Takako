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

  cancelItemRequest = () => {
    this.props.updateItemRequest(this.props.match.params.requestId, {"status": 1, "process_status": "request_cancelled"});
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
             <p>Price    :  {requestHistory.proposed_price}</p>
           </div>
         )}
         {
         /* meetup option decided */
         is_requester && item_request_status === 2 && process_status === "meetup_decided" && (
           <div class="history-box initial">
             <div class="history-wrapper">
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
           <div class="history-box">
             <div class="history-wrapper">
               <p>Your request was rejected by {requestHistory.respondent.first_name}</p>
             </div>
           </div>
         )}
         {/*the request was cancelled*/
         is_requester && item_request_status === 1 && (
           <div class="history-box">
             <div class="history-wrapper">
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
             <p>Price    :  {requestHistory.proposed_price}</p>
           </div>
         )}

         {
         /* meetup option decided */
         is_traveler && item_request_status === 2 && process_status === "meetup_decided" && (
           <div class="history-box initial">
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
         /* meetup option suggested by requester */
         is_traveler && item_request_status === 2 &&
         process_status === "meetup_suggested" && requestHistory.purchase_notification[0].action_taken_by == 1 && (
           <div class="history-box meetups">
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
               <p>Payment completed by {requestHistory.respondent.first_name}</p>
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
               <p>You rejected the request</p>
             </div>
           </div>
         )}

         {/*the request was cancelled*/
         is_traveler && item_request_status === 1 && (
           <div class="history-box">
             <div class="history-wrapper">
               <p>The request was cancelled</p>
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
             <li>Item URL (Optional):   {requestHistory.item_url}</li>
             <li>Number of Item(s):   {requestHistory.n_items}</li>
             <li>Proposed Price:   {requestHistory.proposed_price}</li>
             <li>Commission Fee:   {requestHistory.commission_fee}</li>
             {is_requester && ( <li>Transaction Fee:   {requestHistory.transaction_fee}</li>)}
             {is_requester && (
               <li>
                 Total Payment: {requestHistory.transaction_fee + requestHistory.commission_fee + requestHistory.proposed_price}
               </li>
             )}
             <li>Delivery Method:   Meetup</li>
             <li>Comments (Optional): {requestHistory.comment}</li>
           </ul>
             {is_traveler  && requestHistory.status === 0 && (
               <div>
                 <button class="action-btn" onClick={this.acceptItemRequest}>Accept</button>
                 <button class="action-btn decline" onClick={this.declineItemRequest}>Decline</button>
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
