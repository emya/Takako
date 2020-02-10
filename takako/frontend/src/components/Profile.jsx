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

import StarRatings from 'react-star-ratings';

import { keys } from '../keys.js';

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
          <div class="profile-info">
            {profile.image && (
              <img src={`https://${keys.AWS_BUCKET}.s3-us-west-2.amazonaws.com/profiles/${profile.user.id}/${profile.image}`} />
            )}
            {!profile.image && (<img src={require('../img/default.png')} />)}
            <p>As a Traveler</p>
            <StarRatings
                rating={4.5}
                starHoverColor="#16C4FD"
                starRatedColor="#16C4FD"
                numberOfStars={5}
            />

            <p>As a Requester</p>
            <StarRatings
                rating={4}
                starHoverColor="#16C4FD"
                starRatedColor="#16C4FD"
                numberOfStars={5}
            />

            <p class="user-name"> {profile.user.first_name} {profile.user.last_name} </p>

            <a href="#" class="sns"><i class="fab fa-facebook"></i></a>
            <a href="#" class="sns"><i class="fab fa-instagram"></i></a>
            <p class="object">Location</p>
             {profile.residence}
            <p class="object">Occupation</p>
             {profile.occupation}
            <p class="object">Gender</p>
             {profile.gender}
            <p class="object">About Me</p>
             {profile.bio}
          </div>
        ))}

        <h3>Upcoming Trips</h3>
        <UpcomingTrips is_other="true" userId={`${userId}`}/>

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
