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
import UpcomingTrips from './UpcomingTrips'

library.add(faIgloo)

class Profile extends Component {
  componentDidMount() {
    this.props.fetchProfile(this.props.match.params.userId);
  }

  state = {
    bio: "",
    residence: "",
    updateProfileId: null,
  }

  render() {
    const userId = this.props.match.params.userId;
    return (
  <div>
    <Header />

    <div class="wrapper clearfix">
      <SideMenu />

      <div class="profile">
        {this.props.profile.map((profile) => (
          <div>
            <img src={require('../img/default.png')} />
            <p class="user-data"> {profile.user.first_name} {profile.user.last_name} </p>

            <a href="#" class="sns"><i class="fab fa-facebook"></i></a>
            <a href="#" class="sns"><i class="fab fa-instagram"></i></a>
            <p class="object">Residence</p>
             {profile.residence}
            <p class="object">Occupation</p>
             {profile.occupation}
            <p class="object">Bio</p>
             {profile.bio}
          </div>
        ))}

        <h2>Upcoming Trips</h2>
        <UpcomingTrips is_other="true" userId={`${userId}`}/>

        <h2>Past Transactions</h2>
        <table class="table-data">
          <tr class="table-heading">
            <td>Date</td>
            <td>residence</td>
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
  return {
    profile: state.profile,
  }
}


const mapDispatchToProps = dispatch => {
  return {
    fetchProfile: (userId) => {
      dispatch(profile.fetchProfile(userId));
    },

    logout: () => dispatch(auth.logout()),
  }
}


export default connect(mapStateToProps, mapDispatchToProps)(Profile);
