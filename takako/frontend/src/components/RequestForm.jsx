import React, { Component } from 'react';
import {connect} from 'react-redux';
import {requests} from "../actions";
import moment from 'moment';

import '../css/style.scss';
import { library } from '@fortawesome/fontawesome-svg-core';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faIgloo } from '@fortawesome/free-solid-svg-icons';
import Header from './Header';
import SideMenu from './SideMenu';
import MobileSideMenu from './MobileSideMenu';
import Footer from './Footer';

library.add(faIgloo)

class RequestForm extends Component {
  state = {
    item_name: "",
    item_id: "",
    item_image: null,
    item_url: "",
    n_items: 1,
    price_per_item: 0,
    proposed_price: 0,
    transaction_fee: 0,
    commission_fee: 10,
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
    if(newProps.isSubmissionSucceeded !== this.props.isSubmissionSucceeded){
      this.setState({isSubmissionSucceeded: newProps.isSubmissionSucceeded })
    }
  }

  handleImageChange = (e) => {
    this.setState({
      item_image: e.target.files[0]
    })
  }

  submitRequest = (e) => {
    e.preventDefault();
    this.props.sendRequest(
      this.props.match.params.userId, this.props.match.params.tripId, this.state.item_name,
      this.state.item_id, this.state.item_url, this.state.item_image,
      this.state.price_per_item, this.state.n_items, this.state.proposed_price,
      this.state.commission_fee, this.state.transaction_fee, this.state.delivery_method,
      this.state.preferred_meetup_location, this.state.preferred_meetup_date, this.state.comment
    );
  }

  selectDeliverMethod = (e) => {
    this.setState({delivery_method: e.target.value});
  }

  validateForm = (item_name, n_items, price_per_item, price, commission_fee) => {
    // we are going to store errors for all fields
    // in a signle array
    const errors = [];

    if (item_name.length === 0) {
      errors.push("Item Name can't be empty");
    }

    if (n_items <= 0) {
      errors.push("Minimum Number of Item(s) is 1");
    }

    if (price_per_item.length === 0) {
      errors.push("Price per Item can't be empty");
    }

    if (Number.isInteger(Number(n_items)) === false) {
      errors.push("Number of Item(s) has to be integer");
    }

    if (Number.isInteger(Number(price_per_item)) === false) {
      errors.push("Price per Item has to be integer");
    }

    if (price < 20 || price > 2499) {
      errors.push("Total Item Price has to be between $20 and $2499");
    }

    if (commission_fee < 10) {
      errors.push("Minimum commission fee is 10$");
    }

    return errors;
  }

  proceedRequest = (e) => {
    e.preventDefault();
    const errors = this.validateForm(
      this.state.item_name, this.state.n_items, this.state.price_per_item,
      this.state.proposed_price, this.state.commission_fee);

    if (errors.length > 0) {
      this.setState({ errors });
      return;
    }

    this.setState({isProceeded: true});
  }

  render() {
    const errors = this.state.errors;

    let trip;
    if (this.props.location.state && this.props.location.state.trip) {
      trip = this.props.location.state.trip;
    }

    if (this.state.isSubmissionSucceeded && this.state.isProceeded) {
      return (
      <div>
        <Header />

        <div class="wrapper clearfix">
          <SideMenu />
          <div class="request-conf">
            <h3>Your request was successfully submitted</h3>
            <p><a href="/transaction/status" style={{color: "black"}}>
              Back to the conversation
            </a></p>
          </div>
        </div>

        <MobileSideMenu />
        <Footer />
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
              <p class="form-heading">Item Image</p><br />
              <p class="form-data"> {this.state.item_image && (<img src={URL.createObjectURL(this.state.item_image)} />)} </p><br />
            </div>

            <div class="form-section">
              <p class="form-heading">Price per Item</p><br />
              <p class="form-data">${(+this.state.price_per_item).toLocaleString()} </p><br />
              <p class="form-heading">Number of Item(s)</p><br />
              <p class="form-data">{this.state.n_items} </p><br />
              <p class="form-heading">Total Item Price</p><br />
              <p class="form-data">${(+this.state.proposed_price).toLocaleString()} </p><br />

              <p class="form-heading">Commission to Traveler</p><br />
              <p class="form-data">${(+this.state.commission_fee).toLocaleString()}</p><br />
              <p class="form-heading">Transaction fee</p><br />
              <p class="form-data">${(+this.state.transaction_fee).toLocaleString()}</p><br />
              <p class="form-heading">Your Total Payment</p><br />
              <p class="form-data">${(+this.state.proposed_price + +this.state.commission_fee + +this.state.transaction_fee).toLocaleString()}</p><br />
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

          {this.props.trip && (
            <div class="meetup-rule">
              Important note: Your meetup will take place within one week from {this.props.trip.arrival_date}.
            </div>
          )}
          <button class="form-send-btn btn" onClick={this.submitRequest.bind(this)}>Confirm and Send</button>
        </div>
        </div>

        <MobileSideMenu />
        <Footer />
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

      {trip && (
        <div class="history-summary">
          <h3>Trip summary</h3>
          <p>
            <strong>Destination:   </strong>
            {trip.destination}
          </p>
          <p>
            <strong>Departure date:   </strong>
            {moment(trip.departure_date, "YYYY-MM-DD").format("MM/DD/YY")}
          </p>
          <p>
            <strong>Arrival date:   </strong>
            {moment(trip.arrival_date, "YYYY-MM-DD").format("MM/DD/YY")}
          </p>
          <h3>Traveler</h3>
          <p class="form-heading"> {trip.user.first_name} {trip.user.last_name}</p>
          <p>
            <a href={`/profile/${trip.user.id}`} style={{color: "black"}}>Check Profile</a>
          </p>
        </div>
      )}
      <div class="form-wrapper">

      <div class="form-section">
        {errors.map(error => (
          <p class="error-heading" key={error}>Error: {error}</p>
        ))}
        <p class="form-heading">Item Name<span class="asterisk">*</span></p><br/>
        <input value={this.state.item_name} onChange={(e) => this.setState({item_name: e.target.value})} maxLength="200" required /><br/>

        <p class="form-heading">Item URL</p><br/>
        <input value={this.state.item_url} placeholder="(optional)" onChange={(e) => this.setState({item_url: e.target.value})}  maxLength="300"/><br/>

        <p class="form-heading">Item Image (optional)</p><br/>
        {this.state.item_image && (<img class="request-image" src={URL.createObjectURL(this.state.item_image)} />)}
        <input class="item-upload" type="file" accept="image/png, image/jpeg"  onChange={this.handleImageChange} />

      </div>

      <div class="form-section">
        <p class="form-heading">Price per Item<span class="asterisk">*</span></p><br/>
        $<input type="number" min="0" value={this.state.price_per_item}
         onChange={(e) => this.setState({
           price_per_item: e.target.value,
           proposed_price: e.target.value*this.state.n_items,
           transaction_fee: Math.max(Math.round(e.target.value*this.state.n_items*0.08), 1)
         })}
         required /><br/>

        <p class="form-heading">Number of Item(s) <span class="asterisk">*</span></p><br/>
        <input type="number" value={this.state.n_items}
          onChange={(e) => this.setState({
            n_items: e.target.value,
            proposed_price: e.target.value*this.state.price_per_item,
            transaction_fee: Math.max(Math.round(e.target.value*this.state.price_per_item*0.08), 1)
          })}
        required /><br/>

        <p class="form-heading">Total Item Price (between $20 and $2499)</p><br/>
        $<p class="number-calculated">{(+this.state.proposed_price).toLocaleString()}</p><br/>

        <p class="form-heading">Commission to Traveler (min. $10)</p><br/>
        $<input type="number" placeholder="(Min. $10)" min="10" value={this.state.commission_fee}  onChange={(e) => this.setState({commission_fee: e.target.value})}/><br/>

        <p class="form-heading">Transaction Fee (8% of item price, minimum of $1)</p><br/>
        $<p class="number-calculated">{(+this.state.transaction_fee).toLocaleString()}</p><br/>

        <p class="form-heading">Your Total Payment</p><br/>
        $<p class="number-calculated">{(+this.state.proposed_price + +this.state.transaction_fee + +this.state.commission_fee).toLocaleString()}</p><br/>

      </div>

      <div class="form-section">
        <p class="optional-item">We highly recommend you to fill out the following if you have strong preferences on meetup location or date/time.</p>
        <p class="form-heading">Preferred meetup location</p><br/>
        <input type="text" placeholder="(optional)" value={this.state.preferred_meetup_location} onChange={(e) => this.setState({preferred_meetup_location: e.target.value})}  maxLength="300"/><br/>

        <p class="form-heading">Preferred meetup date/time</p><br/>
        <input type="text" placeholder="(optional)" value={this.state.preferred_meetup_date} onChange={(e) => this.setState({preferred_meetup_date: e.target.value})}  maxLength="300"/><br/>
      </div>


      <div class="form-section">
        <p class="form-heading">Comments</p><br/>
        <input value={this.state.comment} placeholder="(Optional)" onChange={(e) => this.setState({comment: e.target.value})}  maxLength="200"/><br/>

      </div>

      </div>

      {trip && (
        <div class="meetup-rule">
          Important note: Your meetup will take place within one week from {trip.arrival_date}.
        </div>
      )}

        <button class="form-send-btn btn" onClick={this.proceedRequest}>Next</button>
      </form>

    </div>

    <MobileSideMenu />
    <Footer />
  </div>
    )
  }
}

const mapStateToProps = state => {
  return {
    respondent_id: state.respondent_id,
    isSubmissionSucceeded: state.requests.isSubmissionSucceeded,
    isProceeded: state.requests.isProceeded,
    //TODO: Handle trip in reducer
    trip: state.trip,
  }
}

const mapDispatchToProps = dispatch => {
  return {
    sendRequest: (
      respondent_id, trip_id, item_name, item_id, item_url, item_image,
      price_per_item, n_items, proposed_price, commission_fee, transaction_fee,
      delivery_method, preferred_meetup_location, preferred_meetup_date, comment)  => {
      return dispatch(
        requests.sendItemRequest(
          respondent_id, trip_id, item_name, item_id, item_url, item_image,
          price_per_item, n_items, proposed_price, commission_fee, transaction_fee,
          delivery_method, preferred_meetup_location, preferred_meetup_date, comment
        )
      );
      //dispatch(notes.updateNote(id, text));
    },
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(RequestForm);
