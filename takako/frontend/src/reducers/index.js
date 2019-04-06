import { combineReducers } from 'redux';
import notes from "./notes";
import profile from "./profile";
import auth from "./auth";
import traveler_profile from "./traveler_profile";
import transactions from "./transactions"
import search_result from "./search_result"


const takakoApp = combineReducers({
  notes, auth, profile, traveler_profile, transactions, search_result
})

export default takakoApp;