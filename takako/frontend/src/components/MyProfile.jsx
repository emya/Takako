import React, { Component } from 'react';
import {connect} from 'react-redux';
import {profile, auth} from "../actions";

import '../css/style.scss';
import { library } from '@fortawesome/fontawesome-svg-core';
import { faIgloo } from '@fortawesome/free-solid-svg-icons';
import Header from './Header';
import SideMenu from './SideMenu';
import MobileSideMenu from './MobileSideMenu';
import Footer from './Footer';
import UpcomingTrips from './UpcomingTrips';

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
    residence_search: "",
    image: null,
  }

  resetForm = () => {
    this.setState({bio: "", residence: ""});
  }

  handleImageChange = (e) => {
    this.setState({
      image: e.target.files[0]
    })
  }

  submitProfile = (e) => {
    e.preventDefault();
    this.props.updateProfile(
      this.props.profile[0].id, this.state.bio, this.state.residence,
      this.state.occupation, this.state.gender, this.state.image
    ).then(this.resetForm);
  }

  handleChange = (propertyName, profile, event) => {
    profile[propertyName] = event.target.value;
    this.setState({bio: profile.bio, residence: profile.residence, occupation: profile.occupation, gender: profile.gender});
  }

  handleResidenceChange(propertyName, profile, event) {
    profile[propertyName] = event.target.value;
    this.setState({residence_search: event.target.value, residence: event.target.value})
  }

  handleSelectResidenceSuggest(suggest) {
    console.log(suggest.formatted_address);
    this.setState({residence_search: "", residence: suggest.formatted_address})
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
              {this.state.image && (<img src={URL.createObjectURL(this.state.image)} />)}
              {!this.state.image && profile.image && (
                <img src={`https://${keys.AWS_BUCKET}.s3-us-west-2.amazonaws.com/profiles/${profile.user.id}/${profile.image}`} />
               )}
              {!this.state.image && !profile.image && (<img src={require('../img/default.png')} />)}

              <input class="picture-upload" type="file" id="image" accept="image/png, image/jpeg"  onChange={this.handleImageChange} />
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
                        autocompletionRequest={{input: this.state.residence_search, types: ['(regions)']}}
                        googleMaps={googleMaps}
                        onSelectSuggest={this.handleSelectResidenceSuggest.bind(this)}
                      >
                        <input
                          id="residence"
                          class="user-data resi"
                          type="text"
                          value={profile.residence}
                          onChange={this.handleResidenceChange.bind(this, 'residence', profile)}
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


      </div>
    </div>

    <MobileSideMenu />
    <Footer />
  </div>

    )
  }
}


const mapStateToProps = state => {
  console.log(state.profile);
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
    updateProfile: (id, bio, residence, occupation, gender, image) => {
      return dispatch(profile.updateProfile(id, bio, residence, occupation, gender, image));
      //dispatch(notes.updateNote(id, text));
    },
    logout: () => dispatch(auth.logout()),
  }
}


export default connect(mapStateToProps, mapDispatchToProps)(MyProfile);
