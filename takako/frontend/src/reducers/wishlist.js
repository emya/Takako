const initialState = [
  //{text: "Write code!"}
];

export default function wishlist(state=initialState, action) {
  switch (action.type) {

    case 'FETCH_WISHLIST':
      return [...state, action.wishlist];

    case 'ADD_WISHLIST':
      return {...state, 0: [action.wishlist]};

    case 'REMOVE_WISHLIST':
      return {...state, 0: [action.wishlist]};

    default:
      return state;
  }
}