const Notification = ({ message }) => {

  if (!message) return null

  const style = {
    marginTop: 10,
    padding: 5,
    borderStyle: 'solid',
    borderRadius: 5,
    backgroundColor: (message.style === 'error' ? '#fcbbbb' : '#bde8bc'),
    borderColor: (message.style === 'error' ? 'red' : '#3e8a3d'),
    fontSize: 18,
  }

  return (
    <div style={style}>
      {message.text}
    </div>
  )
}

export default Notification