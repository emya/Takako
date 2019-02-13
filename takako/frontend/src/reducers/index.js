import { combineReducers } from 'redux';
import notes from "./notes";
import profile from "./profile";
import auth from "./auth";
import personalshoppers from "./personalshoppers";


const takakoApp = combineReducers({
  notes, auth, profile, personalshoppers
})

export default takakoApp;