import React, { Component } from 'react';
import {connect} from 'react-redux';
import {profile, auth} from "../actions";
import {Link, Redirect} from "react-router-dom";
import MediaQuery from 'react-responsive';
import '../css/style.scss';
import { library } from '@fortawesome/fontawesome-svg-core'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faIgloo } from '@fortawesome/free-solid-svg-icons'
import Header from './Header'
import SideMenu from './SideMenu'

library.add(faIgloo)

class Profile extends Component {
  componentDidMount() {
    console.log(this.props.match.params.userId);
    console.log(this.props);
    this.props.fetchProfile(this.props.match.params.userId);
  }

  state = {
    bio: "",
    location: "",
    updateProfileId: null,
  }

  resetForm = () => {
    this.setState({bio: "", location: "", updateProfileId: null});
  }

  selectForEdit = (profile) => {
    console.log("selectForEdit", profile)
    this.setState({bio: profile.bio, location: profile.location, updateProfileId: profile.id});
  }

  submitProfile = (e) => {
    e.preventDefault();
    this.props.updateProfile(this.state.updateProfileId, this.state.bio, this.state.location).then(this.resetForm);
  }

  handleChange = (propertyName, profile, event) => {
    profile[propertyName] = event.target.value;
    this.setState({bio: profile.bio, location: profile.location, updateProfileId: profile.id});
  }

  render() {
    return (
<div>
   <Header />

    <div class="wrapper clearfix">
      <SideMenu />

      <div class="profile">
        <div class="wrapper clearfix">
          <div class="profile-switch shopper">Shopper Profile</div>
          <div class="profile-switch traveler">Traveler Profile</div>
        </div>

        <a class="message-btn" href="#">Message Traveller</a>

        <form onSubmit={this.submitProfile}>
          {this.props.profile.map((profile) => (
            <div>
              <img src="./img/woman3.jpg"/>
              <p class="user-data"> {profile.user.username} </p>
              <a href="#" class="sns"><i class="fab fa-facebook"></i></a>
              <a href="#" class="sns"><i class="fab fa-instagram"></i></a>
              <p class="object">Residence</p>
              <input type="text" class="user-data" onChange={this.handleChange.bind(this, 'residence', profile)} value={profile.residence}/>
              <p class="object">Occupation</p>
              <input type="text" class="user-data" onChange={this.handleChange.bind(this, 'occupation', profile)} value={profile.occupation}/>
              <p class="object">Bio</p>
              <input type="text" class="user-data" onChange={this.handleChange.bind(this, 'bio', profile)} value={profile.bio}/>
            </div>
          ))}
          <input class="submit-btn" type="submit" value="Save Profile" />
        </form>

        <h2>Upcoming Trips</h2>
        <table class="table-data">
          <tr class="table-heading">
            <td>Date</td>
            <td>Location</td>
            <td>Note</td>
          </tr>
          <tr>
            <td>4/5/2019 - 4/12/2019</td>
            <td>Tokyo, Japan</td>
            <td>Business Trip</td>
          </tr>
        </table>

        <h2>Past Transactions</h2>
        <table class="table-data">
          <tr class="table-heading">
            <td>Date</td>
            <td>Location</td>
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
  console.log("state.auth.user", state.auth);
  console.log("state.profile", state);
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
    updateProfile: (id, bio, location) => {
      return dispatch(profile.updateProfile(id, bio, location));
      //dispatch(notes.updateNote(id, text));
    },
    logout: () => dispatch(auth.logout()),
  }
}


export default connect(mapStateToProps, mapDispatchToProps)(Profile);
