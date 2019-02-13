import React, { Component } from 'react';
import {connect} from 'react-redux';
import {profile, auth} from "../actions";

class PSProfile extends Component {
  componentDidMount() {
    this.props.fetchPSProfiles();
  }

  state = {
    bio: "",
    updateProfileId: null,
  }

  resetForm = () => {
    this.setState({bio: "", updateProfileId: null});
  }

  selectForEdit = (profile) => {
    console.log("selectForEdit", profile)
    this.setState({bio: profile.bio, updateProfileId: profile.id});
  }

  submitProfile = (e) => {
    e.preventDefault();
    this.props.updateProfile(this.state.updateProfileId, this.state.bio).then(this.resetForm);
  }

  handleChange = (propertyName, profile, event) => {
    profile[propertyName] = event.target.value;
    this.setState({bio: profile.bio, updateProfileId: profile.id});
  }

  render() {
    return (
      <div>
        <h2>Welcome to Takako!</h2>
        <hr />

        <div style={{textAlign: "right"}}>
          {this.props.user.username} (<a onClick={this.props.logout}>logout</a>)
        </div>

        <h3>Profile</h3>

      </div>
    )
  }
}


const mapStateToProps = state => {
  console.log("state.auth.user", state.auth);
  console.log("state at mapStateToProps", state);
  return {
    psprofile: state.psprofile,
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
    fetchPSProfiles: () => {
      console.log("mapDispatchToProps fetchPSProfiles")
      dispatch(profile.fetchPSProfiles());
    },
    updateProfile: (id, bio) => {
      return dispatch(profile.updateProfile(id, bio));
      //dispatch(notes.updateNote(id, text));
    },
    logout: () => dispatch(auth.logout()),
  }
}


export default connect(mapStateToProps, mapDispatchToProps)(PSProfile);
