import { useUser } from '../contexts/UserContext'
import { useNotification } from '../contexts/NotificationContext'
import loginService from '../services/login'
import blogService from '../services/blogs'
import Notification from './Notification'
import { Form, Button } from 'react-bootstrap'

const LoginForm = () => {
  const [notification, setNotification] = useNotification()
  const { state, dispatch } = useUser()
  const { user, username, password } = state
  const handleLogin = async (event) => {
    event.preventDefault()
    try {
      const user = await loginService.login({ username, password })
      window.localStorage.setItem('loggedBlogUser', JSON.stringify(user))
      blogService.setToken(user.token)
      dispatch({ type: 'SET_USER', payload: user })
      dispatch({ type: 'SET_USERNAME', payload: '' })
      dispatch({ type: 'SET_PASSWORD', payload: '' })
    } catch (error) {
      const messageObject = {
        text: 'Wrong username or password',
        type: 'error'
      }
      setNotification(messageObject)
    }
  }
  return (
    <div className='container'>
      <Notification message={notification} />
      <Form onSubmit={handleLogin}>
        <Form.Group>
          <Form.Label>
            username
          </Form.Label>
          <Form.Control
            data-testid="username"
            type="text"
            value={username}
            name="Username"
            onChange={({ target }) =>
              dispatch({ type: 'SET_USERNAME', payload: target.value })
            }
          />
        </Form.Group>
        <Form.Group>
          <Form.Label>
            password
          </Form.Label>
          <Form.Control
            data-testid="password"
            type="password"
            value={password}
            name="Password"
            onChange={({ target }) =>
              dispatch({ type: 'SET_PASSWORD', payload: target.value })
            }
          />
        </Form.Group>
        <Button variant='primary' type="submit" name="login">
          login
        </Button>
      </Form>
    </div>
  )
}

export default LoginForm
