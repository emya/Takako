import React, { Component } from 'react';
import {connect} from 'react-redux';
import {notes, auth} from "../actions";

class Note extends Component {
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



  render() {
    return (
      <div>
        <h2>Welcome to Takako!</h2>
        <hr />

        <div style={{textAlign: "right"}}>
          {this.props.user.username} (<a onClick={this.props.logout}>logout</a>)
        </div>

        <h3>Notes</h3>
        <table>
          <tbody>
            {this.props.notes.map((note, id) => (
              <tr>
                <td>{note.text}</td>
                <td><button onClick={() => this.selectForEdit(id)}>edit</button></td>
                <td><button onClick={() => this.props.deleteNote(id)}>delete</button></td>
              </tr>
            ))}
          </tbody>
        </table>

        <h3>Add new note</h3>
        <form onSubmit={this.submitNote}>
          <input
            value={this.state.text}
            placeholder="Enter note here..."
            onChange={(e) => this.setState({text: e.target.value})}
            required />
          <input type="submit" value="Save Note" />
        </form>
      </div>
    )
  }
}


const mapStateToProps = state => {
  console.log("state.auth.user", state.auth);
  return {
    notes: state.notes,
    user: state.auth.user,
  }
}


const mapDispatchToProps = dispatch => {
  return {
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
    logout: () => dispatch(auth.logout()),
  }
}



export default connect(mapStateToProps, mapDispatchToProps)(Note);
