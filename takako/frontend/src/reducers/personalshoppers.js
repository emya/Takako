const initialState = [
  //{text: "Write code!"}
];

export default function notes(state=initialState, action) {
  let noteList = state.slice();

  switch (action.type) {
    case 'FETCH_PERSONALSHOPPERS':
      return [...state, ...action.personalshoppers];

    default:
      return state;
  }
}