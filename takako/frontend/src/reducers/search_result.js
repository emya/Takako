const initialState = [
  //{text: "Write code!"}
];

export default function search_result(state=initialState, action) {
  switch (action.type) {
    case 'FETCH_USERS':
      return [...state, ...action.profiles];

    default:
      return state;
  }
}