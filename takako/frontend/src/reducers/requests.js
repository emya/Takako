const initialState = {
  isSubmissionSucceeded: null,
  isForbidden: null,
  isNotFound: null,
  isPaymentCompleted: null,
  isCancelled: null,
  isItemReceived: null,
  isRated: null,
  isResponded: null,
  isStripeConnected: null,
  isStripeTransferred: null,
  isAlreadyStripeTransferred: null,
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
        switch (action.action_type) {
          case null:
              return {...state, requestHistory: action.data, isResponded: true};
          case "cancel_request":
              return {...state, requestHistory: action.data, isCancelled: true, isResponded: true};
          case "item_received":
              return {...state, requestHistory: action.data, isItemReceived: true};
        }

    case 'RATE_TRAVELER_SUCCESSFUL':
    case 'RATE_REQUESTER_SUCCESSFUL':
        return {...state, ...action.data, isRated: true};

    case 'FORBIDDEN_ERROR':
        return {...state, ...action.data, isForbidden: true};

    case 'NOT_FOUND':
        return {...state, ...action.data, isNotFound: true};

    case 'STRIPE_CONNECT_SUCCESSFUL':
        return {...state, isStripeConnected: true};

    case 'STRIPE_TRANSFER_SUCCESSFUL':
        switch (action.data) {
          case "Transferred":
              return {...state, isStripeTransferred: true};
          case "Already Paid":
              return {...state, isAlreadyStripeTransferred: true};

        }

    default:
      return state;
  }
}