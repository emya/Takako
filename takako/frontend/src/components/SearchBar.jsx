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
                autocompletionRequest={{input: this.state.search_residence}}
                googleMaps={googleMaps}
                onSelectSuggest={this.handleSelectResidenceSuggest.bind(this)}
              >
                <input
                  id="residence"
                  type="text"
                  value={this.state.residence}
                  placeholder="Search by Purchaser's Residence"
                  onChange={this.handleResidenceChange.bind(this)}
                  class="search-box"
                />
              </ReactGooglePlacesSuggest>

              <ReactGooglePlacesSuggest
                autocompletionRequest={{input: this.state.search_destination}}
                googleMaps={googleMaps}
                onSelectSuggest={this.handleSelectDestinationSuggest.bind(this)}
              >
                <input
                  id="destination"
                  type="text"
                  value={this.state.destination}
                  placeholder="Search by trip destination"
                  onChange={this.handleDestinationChange.bind(this)}
                  class="search-box"
                />
              </ReactGooglePlacesSuggest>
            </div>
          )
        }
      />
      <button class="search-btn">Search</button>
    </form>
    )
  }
}

export default SearchBar;
