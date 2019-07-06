import React, {Component} from 'react';
import {auth, actions} from '../actions'
import {connect} from 'react-redux';
import ReactGoogleMapLoader from "react-google-maps-loader";
import ReactGooglePlacesSuggest from "react-google-places-suggest";

import { keys } from '../keys.js';

class SearchBar extends Component {
  state = {
    residence: "",
    destination: "",
    profiles: [],
    search_residence: "",
    search_destination: "",
  }

  handleSubmit = event => {
    event.preventDefault();
    this.props.handleFormSubmit(this.state.residence, this.state.destination);
  }

  handleResidenceChange(e) {
    this.setState({search_residence: e.target.value, residence: e.target.value})
  }

  handleDestinationChange(e) {
    this.setState({search_destination: e.target.value, destination: e.target.value})
  }

  handleSelectResidenceSuggest(suggest) {
    this.setState({search_residence: "", residence: suggest.formatted_address})
  }

  handleSelectDestinationSuggest(suggest) {
    this.setState({search_destination: "", destination: suggest.formatted_address})
  }

  render() {
    return(
    <form onSubmit={this.handleSubmit}>
      <ReactGoogleMapLoader
        params={{
          key: keys.MAP_JS_API,
          libraries: "places,geocode",
        }}
        render={googleMaps =>
          googleMaps && (
            <div>
              <ReactGooglePlacesSuggest
                autocompletionRequest={{input: this.state.search_destination}}
                googleMaps={googleMaps}
                onSelectSuggest={this.handleSelectDestinationSuggest.bind(this)}
              >
                <input
                  id="destination"
                  type="text"
                  value={this.state.destination}
                  placeholder="Where item(s) you want is from?"
                  onChange={this.handleDestinationChange.bind(this)}
                  class="search-box"
                />
              </ReactGooglePlacesSuggest>
              <p>Meetup to receive item(s) should happen in NY, Manhattan</p>
              <button class="btn search">Search</button>
            </div>
          )
        }
      />
    </form>
    )
  }
}

export default SearchBar;
