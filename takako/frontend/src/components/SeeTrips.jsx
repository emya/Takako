import React, { Component } from 'react';
import {connect} from 'react-redux';
import {trips} from "../actions";
import {Link} from "react-router-dom";

import DatePicker from "react-datepicker";
import ReactGoogleMapLoader from "react-google-maps-loader";
import ReactGooglePlacesSuggest from "react-google-places-suggest";

import { keys } from '../keys.js';

import Header from './Header';
import SideMenu from './SideMenu';
import MobileSideMenu from './MobileSideMenu'
import Footer from './Footer'
import '../css/style_LP.scss';

class SeeTrips extends Component {
  componentDidMount() {
    this.props.fetchAllTrips();
  }

  render() {
    return (
      <div>
        <Header />
        <div class="wrapper clearfix">
          {this.props.user && (
            <SideMenu />
          )}
          {!this.props.user && (
            <div class="sidemenu-logout">
              <h3> Let's see available trips</h3>
              <p>
                Find a traveler who get you what you want!
              </p>
            </div>
          )}
          <div class="profile">
            <h2>Trips on Torimo</h2>
            <h3 class="upcoming">Upcoming Trips</h3>
            <table class="table-data">
              <tr class="table-heading-upcoming">
                <td>Date</td>
                <td>Destination</td>
                {this.props.user && (
                  <td>Traveler</td>
                )}
                <td></td>
              </tr>
              {this.props.trips[0] && this.props.trips[0].upcoming_trips && this.props.trips[0].upcoming_trips.map((trip) => (
                <tr>
                  <td>{trip.departure_date} - {trip.arrival_date}</td>
                  <td>{trip.destination}</td>
                  {!this.props.user && (
                    <td><a href="/register" class="btn request">Request Item</a></td>
                  )}
                  {this.props.user && (
                    <td><a href={`/profile/${trip.user.id}`} class="user-link">{trip.user.first_name}</a></td>
                  )}
                  {this.props.user && (
                    <td>
                    <Link to={{
                        pathname: `/request/form/${trip.user.id}/${trip.id}`,
                        state: {
                          trip: trip,
                        }
                      }} class="btn request" >Request Item</Link>
                    </td>
                  )}
                </tr>
              ))}
            </table>

            <h3 class="upcoming">Past Trips</h3>
            <table class="table-data">
              <tr class="table-heading-upcoming">
                <td>Date</td>
                <td>Destination</td>
                <td></td>
              </tr>
              {this.props.trips[0] && this.props.trips[0].past_trips && this.props.trips[0].past_trips.map((trip) => (
                <tr>
                  <td>{trip.departure_date} - {trip.arrival_date}</td>
                  <td>{trip.destination}</td>
                </tr>
              ))}
            </table>
          </div>
        </div>
        <Footer />
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
    fetchAllTrips: () => {
      dispatch(trips.fetchAllTrips());
    },
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(SeeTrips);
