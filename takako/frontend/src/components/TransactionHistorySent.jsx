import React, { Component } from 'react';
import {connect} from 'react-redux';
import {transactions, auth} from "../actions";
import '../css/style.scss';
import MediaQuery from 'react-responsive';
import { library } from '@fortawesome/fontawesome-svg-core'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faIgloo } from '@fortawesome/free-solid-svg-icons'
import Header from './Header'
import SideMenu from './SideMenu'

class TransactionHistory extends Component {
  componentDidMount() {
    this.props.fetchTransactions();
  }

  state = {
    text: "",
    updateNoteId: null,
  }

  render() {
    return (
  <div>
     <Header />

      <div class="wrapper clearfix">
       <SideMenu />

       <div class="transaction-history">
         <p class="bread-crumb"><a href="/transaction/status">Back to Transaction Status</a></p>
         <h2>Sent Request</h2>

         <h3>Transaction Status</h3>
         <div class="status">(*memo to Emi: after initial request is sent) Souvenir will notify you once your request is accepted/declined.</div>
         <div class="status">(*memo to Emi: after request accepted) Your request was accepted, now make a payment!
          <button class="action-btn">Pay</button>
          <div class="status">(*memo to Emi: after pmt is made) Souvenir will notify you once your item was purchased.</div>
         <div class="status">(*memo to Emi: after item is purchased) Notify Souvenir when you receive the item!
          <button class="action-btn">Notify</button>
         </div>

         <h3>Transaction History</h3>
         <div class="history-box">
           <div class="history-wrapper">
             <p>Item received by You</p><p>5/6/2019</p>
          </div>
         </div>
         <div class="history-box">
           <div class="history-wrapper">
             <p>Payment made by You</p><p>5/4/2019</p>
           </div>
         </div>
         <div class="history-box">
           <div class="history-wrapper">
             <p>Request accepted by Chiaki</p><p>5/2/2019</p>
           </div>
         </div>
         <div class="history-box initial">
           <div class="history-wrapper">
             <p>Request sent by You</p><p>5/1/2019</p>
           </div>
           <ul class="request-data">
             <li>User Name:   Emi</li>
             <li>Location:   Seattle</li>
             <li>Item Name:   Chocolate</li>
             <li>Item ID (Optional):   12345</li>
             <li>Item URL (Optional):   https://chocolate.com</li>
             <li>Item Category:   Food</li>
             <li>Delivery by:    6/1/2019</li>
             <li>Proposed Price (item price + commission):   $20</li>
             <li>Preferred Delivery Method:   Ship</li>
             <li>Comments (Optional):</li>
           </ul>
         </div>
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
    sent_requests: state.sent_requests,
    received_requests: state.received_requests,
    user: state.auth.user,
  }
}


const mapDispatchToProps = dispatch => {
  return {
    fetchTransactions: () => {
      dispatch(transactions.fetchTransactions());
    },
    logout: () => dispatch(auth.logout()),
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(TransactionHistory);
