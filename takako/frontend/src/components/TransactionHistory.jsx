import React, { Component } from 'react';
import {connect} from 'react-redux';
import {requests, auth} from "../actions";
import '../css/style.scss';
import MediaQuery from 'react-responsive';
import { library } from '@fortawesome/fontawesome-svg-core'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faIgloo } from '@fortawesome/free-solid-svg-icons'
import Header from './Header'
import SideMenu from './SideMenu'

class TransactionHistory extends Component {
  componentDidMount() {
    this.props.fetchRequestHistory(this.props.match.params.requestId);
  }

  state = {
    text: "",
    updateNoteId: null,
  }

  render() {
    console.log(this.props.requests);
    return (
  <div>
     <Header />

      <div class="wrapper clearfix">
       <SideMenu />

       <div class="transaction-history">
         <p class="bread-crumb"><a href="/transaction/status">Back to Transaction Status</a></p>
         <h2>Received Request</h2>

         <h3>Transaction Status</h3>
         <div class="status">(*memo to Emi: after initial request is received) Accept or Decline the request!</div>
         <div class="status">(*memo to Emi: when waiting for the pmt) Souvenir will notify you once the payment is made.</div>
         <div class="status">(*memo to Emi: after pmt is made) Purchase the item and notify Souvenir.
          <button class="action-btn">Notify</button>
         </div>

         <h3>Transaction History</h3>
         <div class="history-box">
           <div class="history-wrapper">
             <p>Item received by Emi</p><p>5/6/2019</p>
          </div>
         </div>
         <div class="history-box">
           <div class="history-wrapper">
             <p>Payment made by Emi</p><p>5/4/2019</p>
           </div>
         </div>
         <div class="history-box">
           <div class="history-wrapper">
             <p>Request accepted by you</p><p>5/2/2019</p>
           </div>
         </div>
         {this.props.requests.requestHistory && (
             <div class="history-box initial">
               <div class="history-wrapper">
                 <p>Request sent by {this.props.requests.requestHistory.requester.username}</p><p>5/1/2019</p>
               </div>
               <ul class="request-data">
                 <li>User Name:   {this.props.requests.requestHistory.requester.username}</li>
                 <li>Location:   {this.props.requests.requestHistory.trip.destination}</li>
                 <li>Item Name:  {this.props.requests.requestHistory.item_name}</li>
                 <li>Item ID (Optional):   {this.props.requests.requestHistory.item_id}</li>
                 <li>Item URL (Optional):   {this.props.requests.requestHistory.item_url}</li>
                 <li>Proposed Price (item price + commission):   {this.props.requests.requestHistory.proposed_price}</li>
                 <li>Preferred Delivery Method:   Ship</li>
                 <li>Comments (Optional): {this.props.requests.requestHistory.comment}</li>
               </ul>
               <button class="action-btn">Accept</button>
               <button class="action-btn decline">Decline</button>
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
    logout: () => dispatch(auth.logout()),
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(TransactionHistory);
