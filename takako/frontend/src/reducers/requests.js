const initialState = {
  isSubmissionSucceeded: null,
  isForbidden: null,
  isPaymentCompleted: null,
  isResponded: null,
};

export default function requests(state=initialState, action) {
  switch (action.type) {
    case 'REQUEST_ITEM_SUCCESSFUL':
        return {...state, ...action.data, isSubmissionSucceeded: true};

    case 'REQUEST_ITEM_CHARGE_SUCCESSFUL':
        return {...state, ...action.data, isPaymentCompleted: true};

    case 'SHARE_CONTACT_SUCCESSFUL':
        return {...state, ...action.data, isSubmissionSucceeded: true};

    case 'SUGGEST_MEETUPS_SUCCESSFUL':
        return {...state, ...action.data, isSubmissionSucceeded: true};

    case 'NOTIFY_PURCHASE_SUCCESSFUL':
        return {...state, ...action.data, isSubmissionSucceeded: true};

    case 'FETCH_ITEM_REQUESTS':
        return {...state, ...action.data};

    case 'FETCH_REQUEST_HISTORY':
        return {...state, requestHistory: action.data};

    case 'UPDATE_ITEM_REQUEST':
        return {...state, requestHistory: action.data, isResponded: true};

    case 'FORBIDDEN_ERROR':
        return {...state, ...action.data, isForbidden: true};

    default:
      return state;
  }
}