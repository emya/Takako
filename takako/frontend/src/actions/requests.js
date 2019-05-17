import { push } from 'react-router-redux';

export const sendItemRequest = (respondent_id, trip_id, item_name, item_id, item_url, proposed_price, delivery_method, comment) => {
  return (dispatch, getState) => {
    let headers = {"Content-Type": "application/json"};
    let {token} = getState().auth;

    if (token) {
      headers["Authorization"] = `Token ${token}`;
    }

    let body = JSON.stringify({respondent_id, trip_id, item_name, item_id, item_url, proposed_price: parseInt(proposed_price), delivery_method, comment, });

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

