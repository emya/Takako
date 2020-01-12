const initialState = [
  //{text: "Write code!"}
];

export default function wishlist(state=initialState, action) {
  let tripList = state.slice();

  switch (action.type) {

    case 'FETCH_WISHLIST':
      return {...state, wishlist: action.wishlist};

    default:
      return state;
  }
}