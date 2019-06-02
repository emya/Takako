import React, { Component } from 'react';
import {connect} from 'react-redux';
import {requests, auth} from "../actions";
import {Link, Redirect} from "react-router-dom";
import MediaQuery from 'react-responsive';
import '../css/style.scss';
import { library } from '@fortawesome/fontawesome-svg-core'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faIgloo } from '@fortawesome/free-solid-svg-icons'
import Header from './Header'
import SideMenu from './SideMenu'

library.add(faIgloo)

class RequestForm extends Component {

  state = {
    item_name: "",
    item_id: "",
    item_url: "",
    proposed_price: "",
    delivery_method: "0",
    comment: "",
    updateTripId: null,
    isSubmissionSucceeded: null,
  }

   componentWillReceiveProps(newProps){
     if(newProps.isSubmissionSucceeded != this.props.isSubmissionSucceeded){
         this.setState({isSubmissionSucceeded: newProps.isSubmissionSucceeded })
     }
  }

  submitRequest = (e) => {
    e.preventDefault();
    this.props.sendRequest(
      this.props.match.params.userId, this.props.match.params.tripId, this.state.item_name,
      this.state.item_id, this.state.item_url, this.state.proposed_price,
      this.state.delivery_method, this.state.comment
    );
  }

  selectDeliverMethod = (e) => {
    this.setState({delivery_method: e.target.value});
  }

  render() {
    if (this.state.isSubmissionSucceeded) {
      return (
      <div>
        <Header />

        <div class="wrapper clearfix">
         <SideMenu />
         <p>Your request was successfully submitted</p>
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
    return (
  <div>
    <Header />

    <div class="wrapper clearfix">
      <SideMenu />

      <form onSubmit={this.submitRequest} class="request-form">
      <h2>Item Request</h2>
      <div class="request-form-wrapper">
        <p class="request-form-index">Item Name</p>
        <input value={this.state.item_name} onChange={(e) => this.setState({item_name: e.target.value})} required /><br/>

        <p class="request-form-index">Item ID</p>
        <input value={this.state.item_id} placeholder="(Optional)" onChange={(e) => this.setState({item_id: e.target.value})} /><br/>

        <p class="request-form-index">Item URL</p>
        <input value={this.state.item_url} placeholder="(Optional)" onChange={(e) => this.setState({item_url: e.target.value})} /><br/>

        <p class="request-form-index">Preferred Delivery Method</p>
        <select onChange={this.selectDeliverMethod} value={this.state.delivery_method}>
        <option value="0">Ship</option>
        <option value="1">Pick UP/Meet Up</option>
        </select><br/>

        <p class="request-form-index">Item Price</p>
        <input type="number" value={this.state.proposed_price} onChange={(e) => this.setState({proposed_price: e.target.value})} required /><br/>

        <p class="request-form-index">Commission to Purchaser</p>
        <input placeholder=""/><br/>

        <p class="request-form-index">Transaction Fee (3%)</p>
        <input placeholder=""/><br/>

        <p class="request-form-index">Shipping Estimate</p>
        <input placeholder="(If Applicable)"/><br/>

        <p class="request-form-index">My Total Payment</p>
        <input placeholder=""/><br/>

        <p class="request-form-index">Deadline</p>
        <input placeholder=""/><br/>

        <p class="request-form-index">Comments</p>
        <input value={this.state.comment} placeholder="(Optional)" onChange={(e) => this.setState({comment: e.target.value})} /><br/>

      </div>
        <input class="form-send-btn" type="submit" value="Send request" />
      </form>

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
    respondent_id: state.respondent_id,
    isSubmissionSucceeded: state.requests.isSubmissionSucceeded,
  }
}

const mapDispatchToProps = dispatch => {
  return {
    sendRequest: (respondent_id, trip_id, item_name, item_id, item_url, proposed_price, delivery_method, comment)  => {
      return dispatch(requests.sendItemRequest(respondent_id, trip_id, item_name, item_id, item_url, proposed_price, delivery_method, comment));
      //dispatch(notes.updateNote(id, text));
    },
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(RequestForm);
