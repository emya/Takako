import { combineReducers } from 'redux';
import notes from "./notes";
import requests from "./requests";
import trips from "./trips";
import wishlist from "./wishlist";
import profile from "./profile";
import auth from "./auth";
import traveler_profile from "./traveler_profile";
import messages from "./messages"
import contact from "./contact"


const takakoApp = combineReducers({
  notes, auth, profile, trips, wishlist, requests, traveler_profile, messages, contact
})

export default takakoApp;