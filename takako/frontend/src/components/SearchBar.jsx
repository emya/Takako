import React, {Component} from 'react';
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
      <div>
        <h2>Find Traveler</h2>
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
                    autocompletionRequest={{input: this.state.search_destination, types: ['(regions)']}}
                    googleMaps={googleMaps}
                    onSelectSuggest={this.handleSelectDestinationSuggest.bind(this)}
                  >
                    <input
                      id="destination"
                      type="text"
                      value={this.state.destination}
                      placeholder="Where do you want your item(s) from?"
                      onChange={this.handleDestinationChange.bind(this)}
                      class="search-box"
                    />
                  </ReactGooglePlacesSuggest>
                  <button class="btn search">Search</button>
                  <p>Meetup to receive item(s) takes place in Manhattan, NY</p>
                </div>
              )
            }
          />
        </form>
    </div>
    )
  }
}

export default SearchBar;
