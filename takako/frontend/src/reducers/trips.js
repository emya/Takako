const initialState = [
  //{text: "Write code!"}
];

export default function trips(state=initialState, action) {
  let tripList = state.slice();

  switch (action.type) {

    case 'ADD_TRIP':
      return [...state, action.trip];
      //return [...state, {text: action.text}];

    case 'UPDATE_TRIP':
      let tripToUpdate = tripList[action.index]
      tripToUpdate.destination = action.trip.destination;
      tripList.splice(action.index, 1, tripToUpdate);
      return tripList;

    case 'DELETE_TRIP':
      tripList.splice(action.id, 1);
      return tripList;

    case 'FETCH_TRIPS':
      //return [...state, ...action.trips];
      //return {...state, trips: action.trips};
      return [...state, action.trips];

    case 'FETCH_TRIP':
      return {...state, trip: action.trip};

    default:
      return state;
  }
}