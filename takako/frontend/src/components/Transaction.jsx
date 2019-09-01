import React, { Component } from 'react';
import {connect} from 'react-redux';
import {requests, auth} from "../actions";
import '../css/style.scss';
import Header from './Header';
import SideMenu from './SideMenu';
import MobileSideMenu from './MobileSideMenu';
import Footer from './Footer';
import moment from 'moment';
import { faDollarSign, faLightbulb, faGift } from '@fortawesome/free-solid-svg-icons'

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

          <h2>My Transactions</h2>

          <h3 class="request">Sent Request</h3>
          <table class="table-data">
            <tr class="table-heading">
              <td>Date Sent</td>
              <td>User</td>
              <td>Travel Date</td>
              <td>Item</td>
              <td>Destination</td>
              <td>Status</td>
              <td class="detail-heading"></td>
            </tr>

            {this.props.requests.sent_item_requests && this.props.requests.sent_item_requests.map((sent_item_request) => (
              <tr class="transaction-data">
                <td>{sent_item_request.created_at && moment(sent_item_request.created_at, "YYYY-MM-DD HH:mm:ss").format("YYYY-MM-DD")}</td>
                <td>{sent_item_request.respondent.first_name} {sent_item_request.respondent.last_name}</td>
                <td>{sent_item_request.trip.departure_date} - {sent_item_request.trip.arrival_date}</td>
                <td>{sent_item_request.item_name}</td>
                <td>{sent_item_request.trip.destination}</td>
                <td class="transaction-status">
                  {sent_item_request.status === 0 && ("Pending")}
                  {sent_item_request.status === 1 && ("Cancelled")}
                  {sent_item_request.status === 3 && ("Rejected")}

                  {sent_item_request.status === 2 && sent_item_request.process_status == "request_responded" && (
                    <div>
                    <div class="action-required">!</div>
                    <p class="action-required-text">Action Required</p>
                    </div>
                  )}
                  {sent_item_request.status === 2 && sent_item_request.process_status == "payment_made" && ("Paid")}
                  {sent_item_request.status === 2 && sent_item_request.process_status == "purchase_notified" && (
                    <div>
                    <div class="action-required">!</div>
                    <p class="action-required-text">Action Required</p>
                    </div>
                  )}
                  {sent_item_request.status === 2 && sent_item_request.process_status == "meetup_suggested" && ("Deciding Meetup")}
                  {sent_item_request.status === 2 && sent_item_request.process_status == "meetup_decided" && ("Decided Meetup")}
                </td>
                <td>
                  <a class="btn detail" href={`/transaction/history/${sent_item_request.id}`}>Details</a>
                </td>
              </tr>
            ))}

          </table>

          <h3 class="request">Received Request</h3>
          <table class="table-data">
            <tr class="table-heading">
              <td>Date Received</td>
              <td>User</td>
              <td>Travel Date</td>
              <td>Item</td>
              <td>Destination</td>
              <td>Status</td>
              <td class="detail-heading"></td>
            </tr>

            {this.props.requests.received_item_requests && this.props.requests.received_item_requests.map((received_item_request) => (
              <tr class="transaction-data">
                <td>{received_item_request.created_at && moment(received_item_request.created_at, "YYYY-MM-DD HH:mm:ss").format("YYYY-MM-DD")}</td>
                <td>{received_item_request.requester.first_name} {received_item_request.requester.last_name}</td>
                <td>{received_item_request.trip.departure_date} - {received_item_request.trip.arrival_date}</td>
                <td>{received_item_request.item_name}</td>
                <td>{received_item_request.trip.destination}</td>
                <td class="transaction-status">
                  {received_item_request.status === 0 && (
                    <div>
                    <div class="action-required">!</div>
                    <p class="action-required-text">Action Required</p>
                    </div>
                  )}
                  {received_item_request.status === 1 && ("Cancelled")}
                  {received_item_request.status === 3 && ("Rejected")}

                  {received_item_request.status === 2 && received_item_request.process_status == "request_responded" && ("Accepted")}
                  {received_item_request.status === 2 && received_item_request.process_status == "payment_made" && (
                    <div>
                    <div class="action-required">!</div>
                    <p class="action-required-text">Action Required</p>
                    </div>
                  )}
                  {received_item_request.status === 2 && received_item_request.process_status == "purchase_notified" && ("Purchased")}
                  {received_item_request.status === 2 && received_item_request.process_status == "meetup_suggested" && ("Deciding Meetup")}
                  {received_item_request.status === 2 && received_item_request.process_status == "meetup_decided" && ("Decided Meetup")}
                  {received_item_request.status === 2 && ("Accepted")}
                  </td>
                <td>
                  <a class="btn detail" href={`/transaction/history/${received_item_request.id}`}>Details</a>
                </td>
              </tr>
            ))}
          </table>
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
    fetchItemRequests: (userId) => {
      dispatch(requests.fetchItemRequests(userId));
    },
    logout: () => dispatch(auth.logout()),
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Transaction);
