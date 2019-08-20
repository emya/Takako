const initialState = {
  isSubmissionSucceeded: null,
};

export default function requests(state=initialState, action) {
  switch (action.type) {
    case 'SEND_CONTACT_US':
      return {...state, ...action.data, isSubmissionSucceeded: true};

    default:
      return state;
  }
}