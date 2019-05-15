import React, { Component } from 'react';
import {connect} from 'react-redux';
import {trips, auth} from "../actions";
import {Link, Redirect} from "react-router-dom";
import MediaQuery from 'react-responsive';
import '../css/style_LP.scss';

class UpcomingTrips extends Component {
  componentDidMount() {
    if (this.props.is_other == "true") {
      this.props.fetchTrips(this.props.userId);
    } else {
      this.props.fetchTrips(this.props.user.id);
    }
    console.log("this.props", this.props);
  }

  state = {
    departure_date: "",
    arrival_date: "",
    destination: "",
    updateTripId: null,
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
        </tr>
        {this.props.trips.map((trip) => (
          <tr>
            <td>{trip.departure_date} - {trip.arrival_date}</td>
            <td>{trip.destination}</td>
            {is_other && <a href={`/request/form/${userId}/${trip.id}`} style={{color: "black"}}>Request Item</a> }
          </tr>
        ))}
      </table>

      {!is_other &&
        <div>
          <h3>Add new trip</h3>
          <form onSubmit={this.submitTrip}>
            <input value={this.state.departure_date}
            placeholder="Enter departure date"
            onChange={(e) => this.setState({departure_date: e.target.value})}
            required />

            <input value={this.state.arrival_date}
            placeholder="Enter arrival date"
            onChange={(e) => this.setState({arrival_date: e.target.value})}
            required />

            <input value={this.state.destination}
            placeholder="Enter destination"
            onChange={(e) => this.setState({destination: e.target.value})}
            required />
            <input type="submit" value="Save Trip" />
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
