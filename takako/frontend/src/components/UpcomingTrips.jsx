import React, { Component } from 'react';
import {connect} from 'react-redux';
import {trips, auth} from "../actions";
import {Link, Redirect} from "react-router-dom";
import MediaQuery from 'react-responsive';

import DatePicker from "react-datepicker";
import "../../node_modules/react-datepicker/dist/react-datepicker.css";
import '../css/style_LP.scss';

class UpcomingTrips extends Component {
  componentDidMount() {
    if (this.props.is_other == "true") {
      this.props.fetchTrips(this.props.userId);
    } else {
      this.props.fetchTrips(this.props.user.id);
    }
  }

  state = {
    //departure_date: "",
    //arrival_date: "",
    departure_date: null,
    arrival_date: null,
    destination: "",
    updateTripId: null,
  }

  handleDepartureDateChange(date) {
    console.log(date);
    this.setState({departure_date: date});
  }

  handleArrivalDateChange(date) {
    this.setState({arrival_date: date});
  }

  resetForm = () => {
    this.setState({departure_date: "", arrival_date: "",  destination: "", updateNoteId: null});
  }

  selectForEdit = (id) => {
    let trip = this.props.trips[id];
    this.setState({
      departure_date: trip.departure_date,
      arrival_date: trip.arrival_date,
      destination: trip.destination,
      updateTripId: id});
  }

  submitTrip = (e) => {
    e.preventDefault();
    if (this.state.updateTripId === null) {
      this.props.addTrip(this.state.departure_date, this.state.arrival_date, this.state.destination).then(this.resetForm)
    } else {
      this.props.updateTrip(this.state.updateTripId, this.state.departure_date).then(this.resetForm);
    }
    //this.resetForm();
  }

  render() {
    let userId;
    let is_other = false;
    if (this.props.is_other && this.props.is_other == "true") {
      is_other = true;
      userId = this.props.userId;
    }
    console.log("is_other", is_other);

    return (
    <div>
      <table class="table-data">
        <tr class="table-heading">
          <td>Date</td>
          <td>Destination</td>
          <td></td>
        </tr>
        {this.props.trips.map((trip) => (
          <tr>
            <td>{trip.departure_date} - {trip.arrival_date}</td>
            <td>{trip.destination}</td>
            <td>{is_other && <a class="request-btn" href={`/request/form/${userId}/${trip.id}`} >Request Item</a> }</td>
          </tr>
        ))}
      </table>

      {!is_other &&
        <div class="add-new-trip">
          <h3>Add New Trip</h3>
          <form onSubmit={this.submitTrip}>
            <p class="object">Departure Date</p>
            <DatePicker selected={this.state.departure_date} onChange={this.handleDepartureDateChange.bind(this)}/>
            <p class="object">Arrival Date</p>
            <DatePicker selected={this.state.arrival_date} onChange={this.handleArrivalDateChange.bind(this)}/>

            <p class="object">Trip Destination</p>
            <input class="trip-entry" value={this.state.destination}
            placeholder="Enter destination"
            onChange={(e) => this.setState({destination: e.target.value})}
            required />
            <input class="submit-btn" type="submit" value="Save Trip" />
          </form>
        </div>
      }
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
    addTrip: (departure_date, arrival_date, destination) => {
      return dispatch(trips.addTrip(departure_date, arrival_date, destination));
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
