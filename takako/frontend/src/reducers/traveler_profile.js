const initialState = [
  //{text: "Write code!"}
];

export default function traveler_profile(state=initialState, action) {
  //let noteList = state.slice();

  switch (action.type) {
    case 'UPDATE_TRAVELER_PROFILE':
      /*
      let profileToUpdate = noteList[action.profile]
      noteToUpdate.text = action.note.text;
      noteList.splice(action.index, 1, noteToUpdate);
      return noteList;
      */
      return [...state, ...action.traveler_profile];

    case 'FETCH_TRAVELER_PROFILES':
      console.log("FETCH_TRAVELER_PROFILES");
      return [...state, ...action.traveler_profile];

    case 'FETCH_TRAVELER_PROFILES':
      console.log("FETCH_TRAVELER_PROFILES");
      console.log("action", action)
      console.log("action.traveler_profile", action.traveler_profile)
      return [...state, ...action.traveler_profile];

    default:
      return state;
  }
}