const initialState = [
  //{text: "Write code!"}
];

export default function profile(state=initialState, action) {
  //let noteList = state.slice();

  switch (action.type) {
    case 'UPDATE_PROFILE':
      /*
      let profileToUpdate = noteList[action.profile]
      noteToUpdate.text = action.note.text;
      noteList.splice(action.index, 1, noteToUpdate);
      return noteList;
      */
      return [...state, ...action.profile];

    case 'FETCH_PROFILES':
      console.log("FETCH_PROFILES");
      return [...state, ...action.profile];

    case 'FETCH_PSPROFILES':
      console.log("FETCH_PSPROFILES");
      console.log("action", action)
      console.log("action.psprofile", action.psprofile)
      return [...state, ...action.psprofile];

    default:
      return state;
  }
}