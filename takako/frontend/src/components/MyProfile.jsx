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
    bio: null,
    residence: null,
    residence_search: "",
    occupation: null,
    gender: null,
    image: null,
    isChanged: false,
    errors: []
  }

  resetForm = () => {
    //this.setState({bio: "", residence: "", occupation: "", gender: ""});
    this.setState({isChanged:false})
  }

  handleImageChange = (e) => {
    this.setState({
      image: e.target.files[0],
      isChanged: true
    })
  }

  submitProfile = (e) => {
    e.preventDefault();

    const errors = this.validateForm(this.state.image);

    if (errors.length > 0) {
      this.setState({ errors });
      return;
    }

    if (this.state.isChanged === false) {
      return;
    }

    this.props.updateProfile(
      this.props.profile[0].id, this.state.bio, this.state.residence,
      this.state.occupation, this.state.gender, this.state.image
    ).then(this.resetForm);
  }

  handleChange = (propertyName, profile, event) => {
    profile[propertyName] = event.target.value;
    this.setState({
      bio: profile.bio, residence: profile.residence,
      occupation: profile.occupation, gender: profile.gender,
      isChanged: true
    });
  }

  handleResidenceChange(propertyName, profile, event) {
    profile[propertyName] = event.target.value;
    this.setState({
      residence_search: event.target.value, residence: event.target.value, isChanged: true
    })
  }

  handleSelectResidenceSuggest(profile, suggest) {
    profile["residence"] = suggest.formatted_address;
    this.setState({
      residence_search: "", residence: suggest.formatted_address, isChanged: true
    })
  }

  validateForm = (image) => {
    // we are going to store errors for all fields
    // in a signle array
    const errors = [];

    if (image && image.size > 3145728) {
      errors.push("Please Select an image smaller than 3 MB");
    }
    return errors;
  }

  render() {
    const errors = this.state.errors;
    return (
  <div>
    <Header />

    <div class="wrapper clearfix">
      <SideMenu />

      <div class="profile">
      <h2>My Profile</h2>
        <form onSubmit={this.submitProfile}>
          {errors.map(error => (
             <p class="error-heading" key={error}>Error: {error}</p>
          ))}
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

              <p class="object">City</p>

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
                        onSelectSuggest={this.handleSelectResidenceSuggest.bind(this, profile)}
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
              <p class="object">About Me</p>
              <input type="text" class="user-data" onChange={this.handleChange.bind(this, 'bio', profile)} value={profile.bio}/>
            </div>
          ))}
          <input class="btn savep" type="submit" value="Save Profile" />
        </form>

        <h3 class="upcoming">Wish list</h3>

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
