import { combineReducers } from 'redux';
import notes from "./notes";
import trips from "./trips";
import profile from "./profile";
import auth from "./auth";
import traveler_profile from "./traveler_profile";
import transactions from "./transactions"
import messages from "./messages"


const takakoApp = combineReducers({
  notes, auth, profile, trips, traveler_profile, transactions, messages
})

export default takakoApp;