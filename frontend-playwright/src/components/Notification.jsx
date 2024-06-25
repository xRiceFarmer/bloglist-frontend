import PropTypes from 'prop-types'

const Notification = ({ message }) => {
  if (message === null) {
    return null
  }
  return <div className={message.type}>{message.text}</div>
}
Notification.propTypes = {
  message: PropTypes.shape({
    text: PropTypes.string.isRequired,
    type: PropTypes.string.isRequired
  })
}
export default Notification
