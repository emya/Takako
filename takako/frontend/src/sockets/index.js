import * as types from '../constants/ActionTypes'
import { addUser, messageReceived, populateUsersList } from '../actions'
import { message } from '../actions'

const setupSocket = (dispatch, username) => {
  const socket = new WebSocket('ws://localhost:8989')

  socket.onopen = () => {
    socket.send(JSON.stringify({
      type: types.ADD_USER,
      name: username
    }))
  }
  socket.onmessage = (event) => {
    const data = JSON.parse(event.data)
    switch (data.type) {
      case types.ADD_MESSAGE:
        dispatch(message.messageReceived(data.message, data.author))
        break
      case types.ADD_USER:
        dispatch(message.addUser(data.name))
        break
      default:
        break
    }
  }

  return socket
}

export default setupSocket
