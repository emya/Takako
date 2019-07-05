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
    isProceeded: null,
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

  proceedRequest = (e) => {
    e.preventDefault();
    this.setState({isProceeded: true});
  }


  render() {
    if (this.state.isSubmissionSucceeded && this.state.isProceeded) {
      return (
      <div>
        <Header />

        <div class="wrapper clearfix">
         <SideMenu />
         <div class="request-conf">
          <p>Your request was successfully submitted</p>
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
    if (this.state.isProceeded) {
      return (
      <div>
        <Header />

        <div class="wrapper clearfix">
         <SideMenu />
         <div class="form">
          <h2>Your Request Summary</h2>
          <div class="form-wrapper">

          <div class="request-summary">
            <div class="form-section">
              <p class="form-heading">Item Name</p><br />
              <p class="form-data">{this.state.item_name}</p><br />
              <p class="form-heading">Item URL</p><br />
              <p class="form-data">{this.state.item_url} </p><br />
            </div>

            <div class="form-section">
              <p class="form-heading">Item Price</p><br />
              <p class="form-data">{this.state.proposed_price} </p><br />
              <p class="form-heading">Commission to Traveler</p><br />
              <p class="form-data">xx</p><br />
              <p class="form-heading">Transaction fee</p><br />
              <p class="form-data">xx</p><br />
              <p class="form-heading">Your Total Payment</p><br />
              <p class="form-data">xx</p><br />
            </div>

            <div class="form-section">
              <p class="form-heading">Comments</p><br />
              <p class="form-data">{this.state.comment}</p><br />
              </div>
            </div>

            </div>
          <div class="meetup-rule">Meetup/Delivery will take place between 1/1/2019 - 1/30/2019</div>
          <button class="form-send-btn btn" onClick={this.submitRequest.bind(this)}>Confirm and Send</button>
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
    return (
  <div>
    <Header />

    <div class="wrapper clearfix">
      <SideMenu />

      <form class="form">
      <h2>Item Request</h2>
      <div class="form-wrapper">

      <div class="form-section">
        <p class="form-heading">Item Name</p><br/>
        <input value={this.state.item_name} onChange={(e) => this.setState({item_name: e.target.value})} required /><br/>

        <p class="form-heading">Item URL</p><br/>
        <input value={this.state.item_url} placeholder="(Optional)" onChange={(e) => this.setState({item_url: e.target.value})} /><br/>

        <p class="form-heading">Item Image</p><br/>
        <input value={this.state.item_url} placeholder="(Optional)" onChange={(e) => this.setState({item_url: e.target.value})} /><br/>
      </div>

      <div class="form-section">
        <p class="form-heading">Item Price</p><br/>
        <input type="number" value={this.state.proposed_price} onChange={(e) => this.setState({proposed_price: e.target.value})} required /><br/>

        <p class="form-heading">Transaction Fee (3%)</p><br/>
        <input placeholder=""/><br/>

        <p class="form-heading">Commission to Traveler</p><br/>
        <input placeholder="(Min. $10)"/><br/>

        <p class="form-heading">Your Total Payment</p><br/>
        <input placeholder=""/><br/>

      </div>


      <div class="form-section">
        <p class="form-heading">Comments</p><br/>
        <input value={this.state.comment} placeholder="(Optional)" onChange={(e) => this.setState({comment: e.target.value})} /><br/>

      </div>


      </div>

      <div class="meetup-rule">Meetup/Delivery will take place between 1/1/2019 - 1/30/2019</div>
        <button class="form-send-btn btn" onClick={this.proceedRequest}>Next</button>
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
    isProceeded: state.requests.isProceeded,
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
