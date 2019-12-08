import React, { Component } from 'react';
import {connect} from 'react-redux';
import '../css/style.scss';
import {requests} from "../actions";

import Header from './Header'
import SideMenu from './SideMenu'
import MobileSideMenu from './MobileSideMenu'
import Footer from './Footer'

import StarRatings from 'react-star-ratings';

class RateTraveler extends Component {
  state = {
    rating: 0,
    torimo_feedback: null,
    errors: []
  }

  changeRating = (newRating, name) => {
    this.setState({
      rating: newRating
    });
  }

  handleFeedback(event) {
    this.setState({torimo_feedback: event.target.value});
  }

  validateForm = (rating) => {
    // we are going to store errors for all fields
    // in a signle array
    const errors = [];

    if (!rating || rating == 0) {
      errors.push("Traveler rating can't be empty");
    }

    return errors
  }

  submitFeedback = (e) => {
    e.preventDefault();
    const errors = this.validateForm(this.state.rating);

    if (errors.length > 0) {
      this.setState({ errors });
      return;
    }

    this.props.rateTraveler(
      this.props.requestId, this.props.travelerId, this.state.rating, this.state.torimo_feedback
    )
    //this.resetForm();
  }

  render() {
    const errors = this.state.errors;
    return (
  <div>
    <h2>Give us your feedback</h2>
    <form onSubmit={this.submitFeedback}>
      {errors.map(error => (
           <p key={error}>Error: {error}</p>
         ))}
      <p class="user-name"> How would you rate the traveler? </p>
      <p class="object">Clear/quick communication?</p>
      <p class="object">Was the item you received in good condition?</p>
      <StarRatings
        rating={this.state.rating}
        starHoverColor="#16C4FD"
        starRatedColor="#16C4FD"
        changeRating={this.changeRating}
        numberOfStars={5}
        name='rating'
      />

      <p class="user-name"> How was your experience on Torimo?</p>
      <input type="textarea" placeholder="Any feedback is welcome!" class="user-data"
        onChange={this.handleFeedback} value={this.state.torimo_feedback} maxLength="200" />
      <input class="btn savet" type="submit" value="Submit Feedback" />
    </form>
  </div>
    )
  }
}

const mapStateToProps = state => {
  return {
    user: state.auth.user,
  }
}

const mapDispatchToProps = dispatch => {
  return {
    rateTraveler: (requestId, travelerId, rating, torimo_feedback) => {
      return dispatch(requests.rateTraveler(
        requestId, travelerId, rating, torimo_feedback
      ));
    },
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(RateTraveler);
