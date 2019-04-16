import { connect } from 'react-redux';
import AddMessageComponent from '../components/AddMessage';
import { message } from '../actions';

const mapDispatchToProps = dispatch => ({
  dispatch: (msg, author) => {
    dispatch(message.addMessage(msg, author))
  }
})

export const AddMessage = connect(() => ({}), mapDispatchToProps)(AddMessageComponent);
