import React, { Component } from 'react';
import {connect} from 'react-redux';
import {requests, trips, auth} from "../actions";
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
  componentDidMount() {
    this.props.fetchTrip(this.props.match.params.tripId);
  }

  state = {
    item_name: "",
    item_id: "",
    item_url: "",
    proposed_price: "",
    delivery_method: "0",
    preferred_meetup_location: "",
    preferred_meetup_date: "",
    comment: "",
    updateTripId: null,
    isSubmissionSucceeded: null,
    isProceeded: null,
    errors: []
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
      this.state.item_id, this.state.item_url, this.state.proposed_price, this.state.delivery_method,
      this.state.preferred_meetup_location, this.state.preferred_meetup_date, this.state.comment
    );
  }

  selectDeliverMethod = (e) => {
    this.setState({delivery_method: e.target.value});
  }

  validateForm = (item_name, price) => {
    // we are going to store errors for all fields
    // in a signle array
    const errors = [];

    if (item_name.length === 0) {
      errors.push("Item Name can't be empty");
    }

    if (price.length === 0) {
      errors.push("Price can't be empty");
    }

    return errors;
  }

  proceedRequest = (e) => {
    e.preventDefault();
    const errors = this.validateForm(this.state.item_name, this.state.proposed_price);

    if (errors.length > 0) {
      this.setState({ errors });
      return;
    }

    this.setState({isProceeded: true});
  }

  render() {
    const errors = this.state.errors;
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
              <p class="form-heading">Preferred meetup location</p><br />
              <p class="form-data">{this.state.preferred_meetup_location} </p><br />
              <p class="form-heading">Preferred meetup date/time</p><br />
              <p class="form-data">{this.state.preferred_meetup_date} </p><br />
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

      {this.props.trip && (
        <div>
          <p>Trip summary</p>
          <p>Destination: {this.props.trip.destination}</p>
        </div>
      )}
      <div class="form-wrapper">

      <div class="form-section">
        {errors.map(error => (
          <p key={error}>Error: {error}</p>
        ))}
        <p class="form-heading">Item Name (required)</p><br/>
        <input value={this.state.item_name} onChange={(e) => this.setState({item_name: e.target.value})} maxLength="200" required/><br/>

        <p class="form-heading">Item URL</p><br/>
        <input value={this.state.item_url} placeholder="(Optional)" onChange={(e) => this.setState({item_url: e.target.value})}  maxLength="300"/><br/>

        <p class="form-heading">Item Image</p><br/>
        <input value={this.state.item_url} placeholder="(Optional)" onChange={(e) => this.setState({item_url: e.target.value})} /><br/>
      </div>

      <div class="form-section">
        <p class="form-heading">Item Price (required)</p><br/>
        <input type="number" value={this.state.proposed_price} onChange={(e) => this.setState({proposed_price: e.target.value})} required /><br/>

        <p class="form-heading">Transaction Fee (3%)</p><br/>
        <input placeholder=""/><br/>

        <p class="form-heading">Commission to Traveler</p><br/>
        <input placeholder="(Min. $10)"/><br/>

        <p class="form-heading">Your Total Payment</p><br/>
        <input placeholder=""/><br/>

      </div>

      <div class="form-section">
        We highly recommend you fill up the following fields if you have some restriction on meetup location or date/time
        <p class="form-heading">Preferred meetup location (optional)</p><br/>
        <input type="text" value={this.state.preferred_meetup_location} onChange={(e) => this.setState({preferred_meetup_location: e.target.value})}  maxLength="300"/><br/>

        <p class="form-heading">Preferred meetup date/time (optional)</p><br/>
        <input type="text" value={this.state.preferred_meetup_date} onChange={(e) => this.setState({preferred_meetup_date: e.target.value})}  maxLength="300"/><br/>
      </div>


      <div class="form-section">
        <p class="form-heading">Comments</p><br/>
        <input value={this.state.comment} placeholder="(Optional)" onChange={(e) => this.setState({comment: e.target.value})}  maxLength="200"/><br/>

      </div>


      </div>

      {this.props.trip && (
        <div class="meetup-rule">Meetup will take place between {this.props.trip.departure_date} - {this.props.trip.arrival_date}</div>
      )}
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
  console.log(state);
  return {
    respondent_id: state.respondent_id,
    isSubmissionSucceeded: state.requests.isSubmissionSucceeded,
    isProceeded: state.requests.isProceeded,
    trip: state.trips.trip
  }
}

const mapDispatchToProps = dispatch => {
  return {
    fetchTrip: (tripId) => {
      dispatch(trips.fetchTrip(tripId));
    },
    sendRequest: (
      respondent_id, trip_id, item_name, item_id, item_url, proposed_price,
      delivery_method, preferred_meetup_location, preferred_meetup_date, comment)  => {
      return dispatch(
        requests.sendItemRequest(
          respondent_id, trip_id, item_name, item_id, item_url, proposed_price,
          delivery_method, preferred_meetup_location, preferred_meetup_date, comment
        )
      );
      //dispatch(notes.updateNote(id, text));
    },
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(RequestForm);
