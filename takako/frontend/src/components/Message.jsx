import React from "react";
import PropTypes from "prop-types";

const Message = ({ message, author }) => (
  <p>
    <div class="chat-cmt-me">{author}:<br/> {message} </div>
  </p>
)

Message.propTypes = {
  message: PropTypes.string.isRequired,
  author: PropTypes.string.isRequired
}

export default Message;