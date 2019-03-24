import React, { Component } from 'react';
import {connect} from 'react-redux';
import {profile, auth} from "../actions";
import {Link, Redirect} from "react-router-dom";
import MediaQuery from 'react-responsive';
import '../css/style.scss';
import { library } from '@fortawesome/fontawesome-svg-core'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faIgloo } from '@fortawesome/free-solid-svg-icons'

library.add(faIgloo)

class Profile extends Component {
  componentDidMount() {
    this.props.fetchProfiles();
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
    <header class="header">
        <div class="topbar-contents">
          <form class="search">
            <input type="search" name="search" placeholder="Search"/>
            <input class="search-button" type="submit" value="Search"/>
          </form>
          <a href="#"><p>APP<br/>LOGO</p></a>
          <div class="login">
            <a class="register" href="#">Get Started</a>
            <a class="signin" href="#">Sign in</a>
          </div>
        </div>

        <div class="mobile-topbar-contents">
          <a href="#" class="mobile-menu-icon"><i class="fa fa-bars">三</i></a>
          <a href="#"><p>APP<br/>LOGO</p></a>
          <a href="#" class="mobile-menu-icon"><i class="fa fa-bars">★</i></a>
        </div>

      <div class="menu">
        <a href="#">HOME</a>
        <a href="#">Request Item</a>
        <a href="#">Find Request</a>
        <a href="#">Mypage</a>
      </div>
    </header>

    <div class="wrapper clearfix">
      <div class="sidemenu">
        <ul>
          <li><a href="#">My Profile</a></li>
          <li><a href="#">Transaction Status</a></li>
          <li><a href="#">Message Box</a></li>
          <li><a href="#">Edit Profile</a></li>
          <li><a href="#">Edit Account</a></li>
          <li><a href="#">Logout</a></li>
          <li><a href="#">Help</a></li>
        </ul>
      </div>

      <div class="profile">
        <div class="wrapper clearfix">
          <div class="profile-switch shopper">Shopper Profile</div>
          <div class="profile-switch traveler">Traveler Profile</div>
        </div>

        <a class="message-btn" href="#">Message Traveller</a>

        <img src="./img/woman3.jpg"/>
        <p class="user-data">Megan Bakken</p>
        <a href="#" class="sns"><i class="fab fa-facebook"></i></a>
        <a href="#" class="sns"><i class="fab fa-instagram"></i></a>
        <p class="active-info">Since 03/2019<br/>Last login 1 day ago</p>
        <p class="object">Gender</p><p class="user-data">Female</p>
        <p class="object">Residence</p><p class="user-data">New York</p>
        <p class="object">Occupation</p><p class="user-data">Employee</p>

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
  console.log("profile", profile);
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
    fetchProfiles: () => {
      dispatch(profile.fetchProfiles());
    },
    updateProfile: (id, bio, location) => {
      return dispatch(profile.updateProfile(id, bio, location));
      //dispatch(notes.updateNote(id, text));
    },
    logout: () => dispatch(auth.logout()),
  }
}


export default connect(mapStateToProps, mapDispatchToProps)(Profile);
