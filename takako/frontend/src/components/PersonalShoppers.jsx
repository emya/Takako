import React, { Component } from 'react';
import {connect} from 'react-redux';
import {notes, auth, personalshoppers} from "../actions";

class PersonalShoppers extends Component {
  componentDidMount() {
    this.props.fetchPersonalShoppers();
  }

  state = {
    text: "",
    updateNoteId: null,
  }

  render() {
    return (
      <div>
        <h2>Welcome to Takako!</h2>
        <hr />

        <div style={{textAlign: "right"}}>
          {this.props.user.username} (<a onClick={this.props.logout}>logout</a>)
        </div>

        <h3>Personal Shoppers</h3>
        <table>
          <tbody>
            {this.props.personalshoppers.map((personalshopper, id) => (
              <tr>
                <td>{personalshopper.user.username}</td>
                <td>{personalshopper.bio}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    )
  }
}


const mapStateToProps = state => {
  console.log("state.auth.user", state.auth);
  return {
    personalshoppers: state.personalshoppers,
    user: state.auth.user,
  }
}


const mapDispatchToProps = dispatch => {
  return {
    fetchPersonalShoppers: () => {
      dispatch(personalshoppers.fetchPersonalShoppers());
    },
    //addNote: (text) => {
    //  dispatch(notes.addNote(text));
    //},
    logout: () => dispatch(auth.logout()),
  }
}



export default connect(mapStateToProps, mapDispatchToProps)(PersonalShoppers);
