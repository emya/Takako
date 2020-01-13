import React, { Component } from 'react';
import {connect} from 'react-redux';
import {wishlist} from "../actions";
import {Link} from "react-router-dom";

import DatePicker from "react-datepicker";
import ReactGoogleMapLoader from "react-google-maps-loader";
import ReactGooglePlacesSuggest from "react-google-places-suggest";

import { keys } from '../keys.js';

import "../../node_modules/react-datepicker/dist/react-datepicker.css";
import '../css/style_LP.scss';

class WishList extends Component {
  componentDidMount() {
    this.props.fetchWishlist();
  }

  state = {
    area: "",
    search: "",
    errors: []
  }

  resetForm = () => {
    this.setState({area: "", updateNoteId: null});
  }

  validateForm = (area) => {
    // we are going to store errors for all fields
    // in a signle array
    const errors = [];

    if (area.length === 0) {
      errors.push("Area can't be empty");
    }

    return errors;
  }

  handleSelectDestinationSuggest(suggest) {
    this.setState({search: "", area: suggest.formatted_address})
  }

  handleDestinationChange(e) {
    this.setState({search: e.target.value, area: e.target.value})
  }

  removeArea = (id, area_key) => {
    this.props.removeArea(id, area_key);
  }

  submitArea = (e) => {
    e.preventDefault();
    const errors = this.validateForm(this.state.area);

    if (errors.length > 0) {
      this.setState({ errors });
      return;
    }

    this.props.addArea(this.state.area).then(this.resetForm)
    //this.resetForm();
  }

  render() {
    const errors = this.state.errors;

    let is_full = false;
    if (this.props.wishlist && this.props.wishlist[0]){
      this.props.wishlist[0].map((wish) => {
        if (wish.area1 && wish.area2 && wish.area3) {
          is_full = true;
        }
      });
    }

    return (
    <div>
      <p>
      Register areas (up to 3) where products you want to get are available. <br/>
      We will let you know when we have traveler(s) going to the areas.
      </p>
      {this.props.wishlist && this.props.wishlist[0] && this.props.wishlist[0].map((wish) => (
        <table class="table-data">
          <tr class="table-heading-upcoming">
            <td>Areas (up to 3)</td>
            <td></td>
          </tr>

          <tr>
            {wish.area1 && (<td>{wish.area1}</td> )}
            {wish.area1 && (<td><button class="btn decline" onClick={() => this.removeArea(wish.id, "area1")}>Remove</button></td>)}
          </tr>

          <tr>
            {wish.area2 && (<td>{wish.area2}</td> )}
            {wish.area2 && (<td><button class="btn decline" onClick={() => this.removeArea(wish.id, "area2")}>Remove</button></td>)}
          </tr>

          <tr>
            {wish.area3 && (<td>{wish.area3}</td> )}
            {wish.area3 && (<td><button class="btn decline" onClick={() => this.removeArea(wish.id, "area3")}>Remove</button></td>)}
          </tr>
        </table>
      ))}

      <div class="add-new-trip">
        <h3>Add New Area to Wish List</h3>
        {is_full && (
           <p>Please remove any of above areas to add new area to Wish List</p>
        )}
        {!is_full && (
        <form onSubmit={this.submitArea}
          onKeyPress={event => {
            if (event.which === 13 /* Enter */) {
              event.preventDefault();
            }
          }}
        >
          {errors.map(error => (
            <p key={error}>Error: {error}</p>
          ))}

          <ReactGoogleMapLoader
            params={{
              key: keys.MAP_JS_API,
              libraries: "places,geocode",
            }}
            render={googleMaps =>
              googleMaps && (
              <div>
                <ReactGooglePlacesSuggest
                  autocompletionRequest={{input: this.state.search, types: ['(regions)']}}
                  googleMaps={googleMaps}
                  onSelectSuggest={this.handleSelectDestinationSuggest.bind(this)}
                  class="google-api"
                >
                  <input
                    id="residence"
                    class="trip-entry"
                    placeholder="Enter area"
                    value={this.state.area}
                    onChange={this.handleDestinationChange.bind(this)}
                  />
                </ReactGooglePlacesSuggest>
              </div>
              )
            }
          />
          <input class="btn savet" type="submit" value="Save Trip" />
        </form>
        )}
      </div>
    </div>

    )
  }
}

const mapStateToProps = state => {
  return {
    wishlist: state.wishlist,
    user: state.auth.user,
  }
}


const mapDispatchToProps = dispatch => {
  return {
    fetchWishlist: () => {
      dispatch(wishlist.fetchWishlist());
    },
    addArea: (area) => {
      return dispatch(wishlist.addArea(area));
    },
    removeArea: (id, area_key) => {
      dispatch(wishlist.removeArea(id, area_key));
    },
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(WishList);
