import React, {Component} from 'react';
import {auth, actions} from '../actions'
import {connect} from 'react-redux';

class SearchBar extends Component {
  state = {
    keyword: "",
    profiles: []
  }

  state = {
    residence: "",
    destination: "",
    profiles: []
  }

  handleSubmit = event => {
    event.preventDefault();
    this.props.handleFormSubmit(this.state.residence, this.state.destination);
  }

  render() {
    return(

      <form onSubmit={this.handleSubmit}>
        <label htmlFor="residence">Residence</label>
        <input id="residence" value={this.state.residence} type="text" onChange={(e) => this.setState({residence: e.target.value})}/>

        <label htmlFor="destination">Destination</label>
        <input id="destination" value={this.state.destination} type="text" onChange={(e) => this.setState({destination: e.target.value})}/>

        <button>Search</button>
      </form>
    )
  }
}

export default SearchBar;

