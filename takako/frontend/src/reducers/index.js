import { combineReducers } from 'redux';
import notes from "./notes";
import profile from "./profile";
import auth from "./auth";
import traveler_profile from "./traveler_profile";
import transactions from "./transactions"


const takakoApp = combineReducers({
  notes, auth, profile, traveler_profile, transactions
})

export default takakoApp;