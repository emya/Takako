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

class Transaction extends Component {
  componentDidMount() {
    this.props.fetchItemRequests(this.props.user.id);
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
              <td>User</td>
              <td>Travel Date</td>
              <td>Item</td>
              <td>Destination</td>
              <td>Status</td>
            </tr>

            {this.props.requests.sent_item_requests && this.props.requests.sent_item_requests.map((sent_item_request) => (
              <tr class="transaction-data">
                <td>{sent_item_request.created_at}</td>
                <td>{sent_item_request.respondent.username}</td>
                <td>{sent_item_request.trip.departure_date} - {sent_item_request.trip.arrival_date}</td>
                <td>{sent_item_request.item_name}</td>
                <td>{sent_item_request.trip.destination}</td>
                <td>
                  {sent_item_request.status == 0 && ("Pending")}
                  {sent_item_request.status == 1 && ("Cancelled")}
                  {sent_item_request.status == 2 && ("Accepted")}
                  {sent_item_request.status == 3 && ("Rejected")}
                  <a href={`/transaction/history/${sent_item_request.id}`} style={{color: "#78BBE6"}}>details</a>
                </td>
              </tr>
            ))}

          </table>

          <h3 class="request">Received Request</h3>
          <table class="table-data">
            <tr class="table-heading">
              <td>Date Received</td>
              <td>User</td>
              <td>Item</td>
              <td>Destination</td>
              <td>Status</td>
              <td>Earning</td>
            </tr>

            {this.props.requests.received_item_requests && this.props.requests.received_item_requests.map((received_item_request) => (
              <tr class="transaction-data">
                <td>{received_item_request.created_at}</td>
                <td>{received_item_request.requester.username}</td>
                <td>{received_item_request.trip.departure_date} - {received_item_request.trip.arrival_date}</td>
                <td>{received_item_request.item_name}</td>
                <td>{received_item_request.trip.destination}</td>
                <td>
                  {received_item_request.status == 0 && ("Pending")}
                  {received_item_request.status == 1 && ("Cancelled")}
                  {received_item_request.status == 2 && ("Accepted")}
                  {received_item_request.status == 3 && ("Rejected")}
                  <a href={`/transaction/history/${received_item_request.id}`} style={{color: "#78BBE6"}}>details</a>
                </td>
              </tr>
            ))}
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
    requests: state.requests,
    user: state.auth.user,
  }
}


const mapDispatchToProps = dispatch => {
  return {
    fetchItemRequests: (userId) => {
      dispatch(requests.fetchItemRequests(userId));
    },
    logout: () => dispatch(auth.logout()),
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Transaction);
