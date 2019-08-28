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
            <p class="user-name"> {profile.user.first_name} {profile.user.last_name} </p>

            <a href="#" class="sns"><i class="fab fa-facebook"></i></a>
            <a href="#" class="sns"><i class="fab fa-instagram"></i></a>
            <p class="object">Residence</p>
             {profile.residence}
            <p class="object">Occupation</p>
             {profile.occupation}
            <p class="object">Gender</p>
             {profile.gender}
            <p class="object">Bio</p>
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
