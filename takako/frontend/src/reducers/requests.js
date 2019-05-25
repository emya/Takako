const initialState = {
  isSubmissionSucceeded: null,
};

export default function requests(state=initialState, action) {
  switch (action.type) {
    case 'REQUEST_ITEM_SUCCESSFUL':
        return {...state, ...action.data, isSubmissionSucceeded: true};

    case 'FETCH_ITEM_REQUESTS':
        return {...state, ...action.data};

    case 'FETCH_REQUEST_HISTORY':
        return {...state, requestHistory: action.data};

    default:
      return state;
  }
}