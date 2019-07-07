export const chargeItemRequest = (item_request_id, user_id, stripe_body) => {
  return (dispatch, getState) => {
    let headers = {"Content-Type": "application/json"};
    let {token} = getState().auth;

    if (token) {
      headers["Authorization"] = `Token ${token}`;
    }

    let body = JSON.stringify({item_request_id, user_id, stripe_body});

    return fetch("/api/requests/charge/", {headers, method: "POST", body})
      .then(res => {
        if (res.status < 500) {
          return res.json().then(data => {
            console.log("data", data);
            return {status: res.status, data};
          })
        } else {
          console.log("Server Error!");
          throw res;
        }
      })
      .then(res => {
        if (res.status === 200) {
          console.log("REQUEST_ITEM_CHARGE_SUCCESSFUL", res.data);
          return dispatch({type: 'REQUEST_ITEM_CHARGE_SUCCESSFUL', trip: res.data});
        } else if (res.status === 401 || res.status === 403) {
          dispatch({type: "AUTHENTICATION_ERROR", data: res.data});
          throw res.data;
        }
      })
  }
}

export const sendItemRequest = (
  respondent_id, trip_id, item_name, item_id, item_url,
  proposed_price, delivery_method, preferred_meetup_location, preferred_meetup_date, comment) => {
  return (dispatch, getState) => {
    let headers = {"Content-Type": "application/json"};
    let {token} = getState().auth;

    if (token) {
      headers["Authorization"] = `Token ${token}`;
    }

    let body = JSON.stringify({
      respondent_id, trip_id, item_name, item_id, item_url,
      proposed_price: parseInt(proposed_price), delivery_method,
      preferred_meetup_location, preferred_meetup_date, comment, });

    console.log("body", body);
    return fetch("/api/requests/item/", {headers, method: "POST", body})
      .then(res => {
        if (res.status < 500) {
          return res.json().then(data => {
            console.log("data", data);
            return {status: res.status, data};
          })
        } else {
          console.log("Server Error!");
          throw res;
        }
      })
      .then(res => {
        if (res.status === 200) {
          console.log("REQUEST_ITEM_SUCCESSFUL", res.data);
          return dispatch({type: 'REQUEST_ITEM_SUCCESSFUL', trip: res.data});
        } else if (res.status === 401 || res.status === 403) {
          dispatch({type: "AUTHENTICATION_ERROR", data: res.data});
          throw res.data;
        }
      })
  }
}

export const fetchItemRequests = (userId) => {
  return (dispatch, getState) => {
    let headers = {"Content-Type": "application/json"};
    let {token} = getState().auth;

    if (token) {
      headers["Authorization"] = `Token ${token}`;
    }

    return fetch(`/api/requests/item/?userId=${userId}`, {headers, method: "GET"})
      .then(res => {
        if (res.status < 500) {
          return res.json().then(data => {
            console.log("data", data);
            return {status: res.status, data};
          })
        } else {
          console.log("Server Error!");
          throw res;
        }
      })
      .then(res => {
        if (res.status === 200) {
          return dispatch({type: 'FETCH_ITEM_REQUESTS', data: res.data});
        } else if (res.status === 401 || res.status === 403) {
          dispatch({type: "AUTHENTICATION_ERROR", data: res.data});
          throw res.data;
        }
      })
  }
}

export const fetchRequestHistory = (requestId) => {
  return (dispatch, getState) => {
    let headers = {"Content-Type": "application/json"};
    let {token} = getState().auth;

    if (token) {
      headers["Authorization"] = `Token ${token}`;
    }

    console.log("headers", headers);

    return fetch(`/api/requests/history/${requestId}/`, {headers, method: "GET"})
      .then(res => {
        if (res.status < 500) {
          return res.json().then(data => {
            return {status: res.status, data};
          })
        } else {
          console.log("Server Error!");
          throw res;
        }
      })
      .then(res => {
        if (res.status === 200) {
          return dispatch({type: 'FETCH_REQUEST_HISTORY', data: res.data});
        } else if (res.status === 401 || res.status === 403) {
          dispatch({type: "AUTHENTICATION_ERROR", data: res.data});
          throw res.data;
        }
      })
  }
}

export const updateItemRequest = (requestId, item_request) => {
  return (dispatch, getState) => {
    let headers = {"Content-Type": "application/json"};
    let {token} = getState().auth;

    if (token) {
      headers["Authorization"] = `Token ${token}`;
    }

    let body = JSON.stringify(item_request);

    return fetch(`/api/requests/item/${requestId}/`, {headers, method: "PATCH", body})
      .then(res => {
        if (res.status < 500) {
          return res.json().then(data => {
            return {status: res.status, data};
          })
        } else {
          console.log("Server Error!");
          throw res;
        }
      })
      .then(res => {
        if (res.status === 200) {
          return dispatch({type: 'UPDATE_ITEM_REQUEST', data: res.data});
        } else if (res.status === 401 || res.status === 403) {
          dispatch({type: "AUTHENTICATION_ERROR", data: res.data});
          throw res.data;
        }
      })
  }
}

export const sendPurchaseNotification= (
  request_id, preferred_phone, preferred_email,
  meetup_option1_d, meetup_option1_dtime, meetup_option1_address, meetup_option1_comment) => {
  return (dispatch, getState) => {
    let headers = {"Content-Type": "application/json"};
    let {token} = getState().auth;

    if (token) {
      headers["Authorization"] = `Token ${token}`;
    }

    let meetup_option1_date = formatDate(meetup_option1_d);
    let meetup_option1 = {
      "date": meetup_option1_date,
      "dtime": meetup_option1_dtime,
      "address": meetup_option1_address,
      "comment": meetup_option1_comment,
    }

    let body = JSON.stringify({
      request_id, preferred_phone, preferred_email, meetup_option1,
    });

    console.log("body", body);
    return fetch("/api/purchase/notification/", {headers, method: "POST", body})
      .then(res => {
        if (res.status < 500) {
          return res.json().then(data => {
            console.log("data", data);
            return {status: res.status, data};
          })
        } else {
          console.log("Server Error!");
          throw res;
        }
      })
      .then(res => {
        if (res.status === 200) {
          console.log("NOTIFY_PURCHASE_SUCCESSFUL", res.data);
          return dispatch({type: 'NOTIFY_PURCHASE_SUCCESSFUL', trip: res.data});
        } else if (res.status === 401 || res.status === 403) {
          dispatch({type: "AUTHENTICATION_ERROR", data: res.data});
          throw res.data;
        }
      })
  }
}

function formatDate(date) {
    var d = new Date(date),
        month = '' + (d.getMonth() + 1),
        day = '' + d.getDate(),
        year = d.getFullYear();

    if (month.length < 2) month = '0' + month;
    if (day.length < 2) day = '0' + day;

    return [year, month, day].join('-');
}