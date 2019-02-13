import React, { Component } from 'react';
import {connect} from 'react-redux';
import {auth} from "../actions";
import {Link, Redirect} from "react-router-dom";

class Takako extends Component {
  /*
  componentDidMount() {
    this.props.fetchNotes();
  }

  state = {
    text: "",
    updateNoteId: null,
  }


  resetForm = () => {
    this.setState({text: "", updateNoteId: null});
  }

  selectForEdit = (id) => {
    let note = this.props.notes[id];
    this.setState({text: note.text, updateNoteId: id});
  }

  submitNote = (e) => {
    e.preventDefault();
    if (this.state.updateNoteId === null) {
      this.props.addNote(this.state.text).then(this.resetForm)
    } else {
      this.props.updateNote(this.state.updateNoteId, this.state.text).then(this.resetForm);
    }
    //this.resetForm();
  }
  */

  render() {
    return (
      <div>
        <h2>Otsukai</h2>
        <hr />

        <div style={{textAlign: "right"}}>
          <Link to="/login">Login</Link>
        </div>

        <div style={{textAlign: "center", backgroundColor: "aliceblue", padding: "30px"}}>
          <p>Get any items from the world without any trip</p>
        </div>

        <div style={{textAlign: "center", padding: "30px"}}>
          <p>Make money during your trip!</p>
        </div>

        <div class="three-boxes">
          <div class="float-gray-box" style={{backgroundColor: "#DCDCDC"}}>
            <p>Get duty-free cosmetics</p>
          </div>
          <div class="float-gray-box" style={{backgroundColor: "#DCDCDC"}}>
            <p></p>
          </div>
          <div class="float-gray-box" style={{backgroundColor: "#DCDCDC"}}>
            <p></p>
          </div>
        </div>

      </div>
    )
  }
}


const mapStateToProps = state => {
  return {
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
    //addNote: (text) => {
    //  dispatch(notes.addNote(text));
    //},
    updateNote: (id, text) => {
      return dispatch(notes.updateNote(id, text));
      //dispatch(notes.updateNote(id, text));
    },
    deleteNote: (id) => {
      dispatch(notes.deleteNote(id));
    },
    */
    logout: () => dispatch(auth.logout()),
  }
}

//export default Takako;
export default connect(mapStateToProps, mapDispatchToProps)(Takako);
