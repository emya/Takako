const initialState = [
  //{text: "Write code!"}
];

export default function transactions(state=initialState, action) {
  switch (action.type) {
    case 'FETCH_TRANSACTIONS':
      console.log("action", action.transactions);
      return [...state, ...action.sent_requests, ...action.received_requests];

    default:
      return state;
  }
}