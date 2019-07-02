import { combineReducers } from 'redux';
import notes from "./notes";
import requests from "./requests";
import trips from "./trips";
import profile from "./profile";
import auth from "./auth";
import traveler_profile from "./traveler_profile";
import messages from "./messages"


const takakoApp = combineReducers({
  notes, auth, profile, trips, requests, traveler_profile, messages
})

export default takakoApp;