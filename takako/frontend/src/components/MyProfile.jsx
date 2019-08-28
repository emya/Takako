import React, { Component } from 'react';
import {connect} from 'react-redux';
import {profile, auth} from "../actions";

import '../css/style.scss';
import { library } from '@fortawesome/fontawesome-svg-core'
import { faIgloo } from '@fortawesome/free-solid-svg-icons'
import Header from './Header'
import SideMenu from './SideMenu'
import MobileSideMenu from './MobileSideMenu'
import Footer from './Footer'
import UpcomingTrips from './UpcomingTrips'

import ReactGoogleMapLoader from "react-google-maps-loader";
import ReactGooglePlacesSuggest from "react-google-places-suggest";

import { keys } from '../keys.js';

library.add(faIgloo)

class MyProfile extends Component {
  componentDidMount() {
    this.props.fetchProfile(this.props.user.id);
  }

  state = {
    bio: "",
    residence: "",
    search: "",
  }

  resetForm = () => {
    this.setState({bio: "", residence: ""});
  }

  submitProfile = (e) => {
    e.preventDefault();
    this.props.updateProfile(
      this.props.profile[0].id, this.state.bio, this.state.residence, this.state.occupation, this.state.gender
    ).then(this.resetForm);
  }

  handleChange = (propertyName, profile, event) => {
    profile[propertyName] = event.target.value;
    this.setState({bio: profile.bio, residence: profile.residence, occupation: profile.occupation, gender: profile.gender});
  }

  handleResidenceChange(e) {
    this.setState({search: e.target.value, residence: e.target.value})
  }

  handleSelectResidenceSuggest(suggest) {
    console.log(suggest.formatted_address);
    this.setState({search: "", residence: suggest.formatted_address})
  }

  render() {
    return (
  <div>
    <Header />

    <div class="wrapper clearfix">
      <SideMenu />

      <div class="profile">
      <h2>My Profile</h2>
        <form onSubmit={this.submitProfile}>
          {this.props.profile.map((profile) => (
            <div>
              <img src={require('../img/default.png')} />
              <p class="user-name"> {profile.user.first_name} {profile.user.last_name} </p>
              <a href="#" class="sns"><i class="fab fa-facebook"></i></a>
              <a href="#" class="sns"><i class="fab fa-instagram"></i></a>

              <p class="object">Residence</p>

              <ReactGoogleMapLoader
                params={{
                  key: keys.MAP_JS_API,
                  libraries: "places,geocode",
                }}
                render={googleMaps =>
                  googleMaps && (
                    <div>
                      <ReactGooglePlacesSuggest
                        autocompletionRequest={{input: this.state.search}}
                        googleMaps={googleMaps}
                        onSelectSuggest={this.handleSelectResidenceSuggest.bind(this)}
                      >
                        <input
                          id="residence"
                          class="user-data resi"
                          type="text"
                          value={profile.residence}
                          onChange={this.handleResidenceChange.bind(this)}
                        />
                      </ReactGooglePlacesSuggest>
                    </div>
                  )
                }
              />

              <p class="object">Occupation</p>
              <input type="text" class="user-data" onChange={this.handleChange.bind(this, 'occupation', profile)} value={profile.occupation}/>
              <p class="object">Gender</p>
              <input type="text" class="user-data" onChange={this.handleChange.bind(this, 'gender', profile)} value={profile.gender}/>
              <p class="object">Bio</p>
              <input type="text" class="user-data" onChange={this.handleChange.bind(this, 'bio', profile)} value={profile.bio}/>
            </div>
          ))}
          <input class="btn savep" type="submit" value="Save Profile" />
        </form>

        <h3 class="upcoming">Upcoming Trips</h3>
        <UpcomingTrips is_other="false"/>

        <h3>Past Transactions</h3>
        <table class="table-data">
          <tr class="table-heading">
            <td>Date</td>
            <td>Residence</td>
            <td>Item</td>
          </tr>
          <tr>
            <td>4/5/2018</td>
            <td>Tokyo, Japan</td>
            <td>Tokyo Banana</td>
          </tr>
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
    profile: state.profile,
    user: state.auth.user,
  }
}


const mapDispatchToProps = dispatch => {
  return {
  /*
    fetchNotes: () => {
      dispatch(notes.fetchNotes());
    },
    addNote: (text) => {
      return dispatch(notes.addNote(text));
    },
    deleteNote: (id) => {
      dispatch(notes.deleteNote(id));
    },
  */
    fetchProfile: (userId) => {
      dispatch(profile.fetchProfile(userId));
    },
    updateProfile: (id, bio, residence, occupation, gender) => {
      return dispatch(profile.updateProfile(id, bio, residence, occupation, gender));
      //dispatch(notes.updateNote(id, text));
    },
    logout: () => dispatch(auth.logout()),
  }
}


export default connect(mapStateToProps, mapDispatchToProps)(MyProfile);
