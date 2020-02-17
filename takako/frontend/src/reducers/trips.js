const initialState = [
  //{text: "Write code!"}
];

export default function trips(state=initialState, action) {
  let tripList = state.slice();

  switch (action.type) {

    case 'ADD_TRIP':
      return [
          {
            upcoming_trips:[
              ...state[0].upcoming_trips,
              {
                id: action.trip.id,
                destination: action.trip.destination,
                origin: action.trip.origin,
                departure_date: action.trip.departure_date,
                arrival_date: action.trip.arrival_date,
                status: action.trip.status,
              }
            ],
            past_trips: [
              ...state[0].past_trips,
            ]
          }
      ];

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
      return [...state, action.trips];

    case 'FETCH_TRIP':
      return {...state, trip: action.trip};

    default:
      return state;
  }
}