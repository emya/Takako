export const fetchTransactions = () => {
  return (dispatch, getState) => {
    let headers = {"Content-Type": "application/json"};
    let {token} = getState().auth;

    console.log("token", token);

    if (token) {
      headers["Authorization"] = `Token ${token}`;
    }

    return fetch("/api/transactions/", {headers, })
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
          console.log("res.data", res.data);
          return dispatch({type: 'FETCH_TRANSACTIONS', sent_requests: res.data.sent_requests, received_requests: res.data.received_requests});
        } else if (res.status === 401 || res.status === 403) {
          dispatch({type: "AUTHENTICATION_ERROR", data: res.data});
          throw res.data;
        }
      })
  }
}


