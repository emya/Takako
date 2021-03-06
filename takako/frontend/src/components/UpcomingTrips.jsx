import React, { Component } from 'react';
import {connect} from 'react-redux';
import {trips} from "../actions";
import {Link} from "react-router-dom";

import moment from 'moment';

import DatePicker from "react-datepicker";
import ReactGoogleMapLoader from "react-google-maps-loader";
import ReactGooglePlacesSuggest from "react-google-places-suggest";

import { keys } from '../keys.js';

import "../../node_modules/react-datepicker/dist/react-datepicker.css";
import '../css/style_LP.scss';

class UpcomingTrips extends Component {
  componentDidMount() {
    if (this.props.is_other === "true") {
      this.props.fetchTrips(this.props.userId);
    } else {
      this.props.fetchTrips(this.props.user.id);
    }
  }

  state = {
    departure_date: null,
    arrival_date: null,
    destination: "",
    origin: "",
    updateTripId: null,
    search_destination: "",
    search_origin: "",
    errors: []
  }

  handleDepartureDateChange(date) {
    this.setState({departure_date: date});
  }

  handleArrivalDateChange(date) {
    this.setState({arrival_date: date});
  }

  resetForm = () => {
    this.setState({departure_date: "", arrival_date: "",  destination: "", origin: "", updateNoteId: null});
  }

  validateForm = (departure_date, arrival_date, destination, origin) => {
    // we are going to store errors for all fields
    // in a signle array
    const errors = [];

    if (!departure_date) {
      errors.push("Departure Date can't be empty");
    }

    if (!arrival_date) {
      errors.push("Arrival Date can't be empty");
    }

    if (destination.length === 0) {
      errors.push("Trip Destination can't be empty");
    }

    if (origin.length === 0) {
      errors.push("Trip Origin can't be empty");
    }

    return errors;
  }

  selectForEdit = (id) => {
    let trip = this.props.trips[id];
    this.setState({
      departure_date: trip.departure_date,
      arrival_date: trip.arrival_date,
      destination: trip.destination,
      origin: trip.origin,
      updateTripId: id});
  }

  handleSelectDestinationSuggest(suggest) {
    this.setState({search_destination: "", destination: suggest.formatted_address})
  }

  handleDestinationChange(e) {
    this.setState({search_destination: e.target.value, destination: e.target.value})
  }

  handleSelectOriginSuggest(suggest) {
    this.setState({search_origin: "", origin: suggest.formatted_address})
  }

  handleOriginChange(e) {
    this.setState({search_origin: e.target.value, origin: e.target.value})
  }

  submitTrip = (e) => {
    e.preventDefault();
    const errors = this.validateForm(
      this.state.departure_date, this.state.arrival_date,
      this.state.destination, this.state.origin
    );

    if (errors.length > 0) {
      this.setState({ errors });
      return;
    }

    if (this.state.updateTripId === null) {
      this.props.addTrip(
        this.state.departure_date, this.state.arrival_date, this.state.destination, this.state.origin).then(this.resetForm)
    } else {
      this.props.updateTrip(this.state.updateTripId, this.state.departure_date).then(this.resetForm);
    }
    //this.resetForm();
  }

  render() {
    let userId;
    let is_other = false;
    if (this.props.is_other && this.props.is_other === "true") {
      is_other = true;
      userId = this.props.userId;
    }
    const errors = this.state.errors;

    return (
    <div>
      <table class="table-data">
        <tr class="table-heading-upcoming">
          <td>Date</td>
          <td>Destination</td>
          <td>Origin</td>
          <td></td>
        </tr>
        {this.props.trips[0] && this.props.trips[0].upcoming_trips && this.props.trips[0].upcoming_trips.map((trip) => (
          <tr>
            <td>{trip.departure_date} - {trip.arrival_date}</td>
            <td>{trip.destination}</td>
            <td>{trip.origin}</td>
            <td>{is_other &&
                 <Link to={{
                   pathname: `/request/form/${userId}/${trip.id}`,
                   state: {
                     trip: trip,
                   }
                 }} class="btn request" >Request Item</Link> }
            </td>
          </tr>
        ))}
      </table>

      {!is_other &&
        <div class="add-new-trip">
          <h3>Add New Trip</h3>
          <form onSubmit={this.submitTrip}
                onKeyPress={event => {
                  if (event.which === 13 /* Enter */) {
                    event.preventDefault();
                  }
                }}
          >
             {errors.map(error => (
               <p key={error}>Error: {error}</p>
             ))}
            <p class="object">Departure Date</p>
            <DatePicker selected={this.state.departure_date} onChange={this.handleDepartureDateChange.bind(this)}/>
            <p class="object">Return Date</p>
            <DatePicker minDate={moment().toDate()} selected={this.state.arrival_date} onChange={this.handleArrivalDateChange.bind(this)}/>

            <p class="object">Trip Destination</p>
            <ReactGoogleMapLoader
                params={{
                  key: keys.MAP_JS_API,
                  libraries: "places,geocode",
                }}
                render={googleMaps =>
                  googleMaps && (
                    <div>
                      <ReactGooglePlacesSuggest
                        autocompletionRequest={{input: this.state.search_destination, types: ['(regions)']}}
                        googleMaps={googleMaps}
                        onSelectSuggest={this.handleSelectDestinationSuggest.bind(this)}
                        class="google-api"
                      >
                        <input
                          id="residence"
                          class="trip-entry"
                          placeholder="Enter destination"
                          value={this.state.destination}
                          onChange={this.handleDestinationChange.bind(this)}
                        />
                      </ReactGooglePlacesSuggest>
                    </div>
                  )
                }
            />

            <p class="object">Trip Origin (Where meetups take place)</p>
            <ReactGoogleMapLoader
                params={{
                  key: keys.MAP_JS_API,
                  libraries: "places,geocode",
                }}
                render={googleMaps =>
                  googleMaps && (
                    <div>
                      <ReactGooglePlacesSuggest
                        autocompletionRequest={{input: this.state.search_origin, types: ['(regions)']}}
                        googleMaps={googleMaps}
                        onSelectSuggest={this.handleSelectOriginSuggest.bind(this)}
                        class="google-api"
                      >
                        <input
                          id="residence"
                          class="trip-entry"
                          placeholder="Enter origin"
                          value={this.state.origin}
                          onChange={this.handleOriginChange.bind(this)}
                        />
                      </ReactGooglePlacesSuggest>
                    </div>
                  )
                }
              />
            <input class="btn savet" type="submit" value="Save Trip" />
          </form>
        </div>
      }

      <h3 class="upcoming">Past Trips</h3>
      <table class="table-data">
        <tr class="table-heading-upcoming">
          <td>Date</td>
          <td>Destination</td>
          <td>Origin</td>
        </tr>
        {this.props.trips[0] && this.props.trips[0].past_trips && this.props.trips[0].past_trips.map((trip) => (
          <tr>
            <td>{trip.departure_date} - {trip.arrival_date}</td>
            <td>{trip.destination}</td>
            <td>{trip.origin}</td>
          </tr>
        ))}
      </table>

    </div>

    )
  }
}

const mapStateToProps = state => {
  return {
    trips: state.trips,
    user: state.auth.user,
  }
}


const mapDispatchToProps = dispatch => {
  return {
    fetchTrips: (userId) => {
      dispatch(trips.fetchTrips(userId));
    },
    addTrip: (departure_date, arrival_date, destination, origin) => {
      return dispatch(trips.addTrip(departure_date, arrival_date, destination, origin));
    },
    updateTrip: (id, text) => {
      return dispatch(trips.updateNote(id, text));
      //dispatch(notes.updateNote(id, text));
    },
    deleteTrip: (id) => {
      dispatch(trips.deleteTrip(id));
    },
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(UpcomingTrips);
