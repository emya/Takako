import React, {Component} from 'react';
import {auth, actions} from '../actions'
import {connect} from 'react-redux';

class SearchBar extends Component {
  state = {
    keyword: "",
    profiles: []
  }

  handleSubmit = event => {
    event.preventDefault();
    this.props.handleFormSubmit(this.state.keyword);
  }

  render() {
    return(

      <form onSubmit={this.handleSubmit}>
        <label htmlFor="username">Keyword</label>
        <input id="keyword" value={this.state.keyword} type="text" onChange={(e) => this.setState({keyword: e.target.value})}/>

        <label htmlFor="email">Trip return</label>
        <input id="trip_return" type="text" />

        <button>Search</button>
      </form>
    )
  }
}

export default SearchBar;

