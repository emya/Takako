const initialState = [
  //{text: "Write code!"}
];

export default function profile(state=initialState, action) {
  let profileList = state.slice();

  switch (action.type) {
    case 'UPDATE_PROFILE':
      console.log(action);
      console.log(action.index);
      console.log(profileList);

      let profileToUpdate = profileList[0]
      console.log(profileToUpdate);

      profileToUpdate.bio = action.profile.bio;
      profileToUpdate.occupation = action.profile.occupation;
      profileToUpdate.residence = action.profile.residence;
      profileList.splice(0, 1, action.profile);
      return profileList;
      /*
      return [...state, ...action.profile];
      */

    case 'FETCH_PROFILES':
      return [...state, ...action.profile];

    default:
      return state;
  }
}