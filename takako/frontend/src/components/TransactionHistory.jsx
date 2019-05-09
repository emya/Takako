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
         <h2>Received Request</h2>
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
         <div class="history-box initial">
           <div class="history-wrapper">
             <p>Request sent by Emi</p><p>5/1/2019</p>
           </div>
           <ul class="request-data">
             <li>User Name:   Emi</li>
             <li>Location:   Seattle</li>
             <li>Item Name:   Chocolate</li>
             <li>Item ID (Optional):   12345</li>
             <li>Item URL (Optional):   https://chocolate.com</li>
             <li>Item Category:   Food</li>
             <li>Want Item by:    6/1/2019</li>
             <li>Proposed Price (incl. shipping):   $20</li>
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
