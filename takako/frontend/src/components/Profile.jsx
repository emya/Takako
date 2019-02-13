import React, { Component } from 'react';
import {connect} from 'react-redux';
import {profile, auth} from "../actions";
import {Link, Redirect} from "react-router-dom";

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
        <h2>Otukai</h2>
        <hr />

        <div style={{textAlign: "right"}}>
          {this.props.user.username} (<a onClick={this.props.logout}>logout</a>)
        </div>

        <h3>Profile</h3>
        <form onSubmit={this.submitProfile}>
          {this.props.profile.map((profile) => (
          <div>
            <label>Bio</label>
            <input type="text" onChange={this.handleChange.bind(this, 'bio', profile)} value={profile.bio}/>
            <label>Location</label>
            <input type="text" onChange={this.handleChange.bind(this, 'location', profile)} value={profile.location}/>
          </div>
          ))}
          <input type="submit" value="Save Profile" />
        </form>

        <p>
          <Link to="/psprofile">Personal Shopper</Link>
        </p>

        <p>
          <Link to="/personalshoppers">Personal Shoppers</Link>
        </p>

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
