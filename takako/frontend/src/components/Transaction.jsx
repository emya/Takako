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

class Transaction extends Component {
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

        <div class="profile">
        
          <h2>Transaction Status</h2>

          <h3 class="request">Sent Request</h3>
          <table class="table-data">
            <tr class="table-heading">
              <td>Date Sent</td>
              <td>Traveler</td>
              <td>Travel Date</td>
              <td>Item</td>
              <td>Location</td>
              <td>Status</td>
            </tr>
            <tr class="transaction-data">
              <td>4/12/2019</td>
              <td>Emi</td>
              <td>4/16/2019 - 4/20/2019</td>
              <td>Makeup</td>
              <td>Tokyo, Japan</td>
              <td>Accepted <a href="/transaction/history" style={{color: "#78BBE6"}}>details</a></td>
            </tr>
            <tr class="transaction-data">
              <td>5/3/2019</td>
              <td>Takumi</td>
              <td>5/20/2019 - 5/25/2019</td>
              <td>Snack</td>
              <td>Paris, France</td>
              <td>Purchased <a href="/transaction/history" style={{color: "#78BBE6"}}>details</a> </td>
            </tr>
          </table>

          <h3 class="request">Received Request</h3>
          <table class="table-data">
            <tr class="table-heading">
              <td>Date Received</td>
              <td>Shopper</td>
              <td>Item</td>
              <td>Location</td>
              <td>Status</td>
              <td>Earning</td>
            </tr>
            <tr class="transaction-data">
              <td>4/5/2018</td>
              <td>Pomi</td>
              <td>Kimono</td>
              <td>Tokyo, Japan</td>
              <td>Declined</td>
              <td>-</td>
            </tr>
            <tr class="transaction-data">
              <td>1/12/2018</td>
              <td>Takumi</td>
              <td>Wine</td>
              <td>Rome, Italy</td>
              <td>Payment Processed</td>
              <td>$30</td>
            </tr>
            <tr class="transaction-data total">
              <td colspan="5">Total Earnings</td>
              <td>$30</td>
            </tr>
          </table>
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

export default connect(mapStateToProps, mapDispatchToProps)(Transaction);
