import { useState, useEffect } from 'react'
import Blog from './components/Blog'
import blogService from './services/blogs'
import loginService from './services/login'
import Notification from './components/Notification'
import Togglable from './components/Togglable'
import BlogForm from './components/BlogForm'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [user, setUser] = useState(null)

  const [message, setMessage] = useState(null)

  useEffect(() => {
    blogService.getAll().then((blogs) => {
      const sortedBlog = blogs.sort((a, b) => b.likes - a.likes)
      setBlogs(sortedBlog)
    })
  }, [])
  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBlogUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      setUser(user)
      blogService.setToken(user.token)
    }
  }, [])

  const handleLogin = async (event) => {
    event.preventDefault()
    try {
      const user = await loginService.login({ username, password })
      window.localStorage.setItem('loggedBlogUser', JSON.stringify(user))
      blogService.setToken(user.token)
      setUser(user)
      setUsername('')
      setPassword('')
    } catch (error) {
      const messageObject = {
        text: 'Wrong username or password',
        type: 'error'
      }
      setMessage(messageObject)
      setTimeout(() => {
        setMessage(null)
      }, 5000)
    }
  }
  const handleLogout = (event) => {
    window.localStorage.removeItem('loggedBlogUser')
    setUser(null)
  }
  const createBlog = async (blogObject) => {
    try {
      const response = await blogService.create(blogObject)
      setBlogs(blogs.concat(response))
      const messageObject = {
        text: `a new blog ${blogObject.title} by ${blogObject.author} added`,
        type: 'success'
      }
      setMessage(messageObject)
      setTimeout(() => {
        setMessage(null)
      }, 5000)
    } catch (error) {
      const messageObject = {
        text: error.response.data.error,
        type: 'error'
      }
      setMessage(messageObject)
      setTimeout(() => {
        setMessage(null)
      }, 5000)
    }
  }
  const loginForm = () => (
    <div>
      <Notification message={message} />

      <form onSubmit={handleLogin}>
        <div>
          username
          <input
            data-testid="username"
            type="text"
            value={username}
            name="Username"
            onChange={({ target }) => setUsername(target.value)}
          />
        </div>
        <div>
          password
          <input
            data-testid="password"
            type="password"
            value={password}
            name="Password"
            onChange={({ target }) => setPassword(target.value)}
          />
        </div>
        <button type="submit" name="login">
          login
        </button>
      </form>
    </div>
  )
  const handleLikes = async (id) => {
    const likedBlog = blogs.find((blog) => blog.id === id)
    if (!likedBlog) {
      console.log('error finding blog')
      return
    }
    const updatedBlog = {
      ...likedBlog,
      likes: likedBlog.likes + 1
    }
    try {
      const response = await blogService.update(id, updatedBlog)
      setBlogs(
        blogs
          .map((blog) => (blog.id === id ? response : blog))
          .sort((a, b) => b.likes - a.likes)
      )
    } catch (error) {
      console.log('Error updating likes', error)
    }
  }
  const deleteBlog = async (id) => {
    const blogToDelete = blogs.find((blog) => blog.id === id)
    if (!blogToDelete) {
      console.log('Error finding blog')
      return
    }
    const confirmDelete = window.confirm(
      `Remove blog ${blogToDelete.title} by ${blogToDelete.author}?`
    )
    if (confirmDelete) {
      try {
        await blogService.remove(id)
        const newBlogs = blogs
          .filter((blog) => blog.id !== id)
          .sort((a, b) => b.likes - a.likes)
        setBlogs(newBlogs)
        setMessage({
          text: `Blog ${blogToDelete.title} deleted`,
          type: 'success'
        })
        setTimeout(() => setMessage(null), 5000)
      } catch (error) {
        setMessage({ text: error.message, type: 'error' })
        setTimeout(() => setMessage(null), 5000)
      }
    }
  }
  if (user === null) {
    return loginForm()
  }
  return (
    <div>
      <Notification message={message} />
      <h2>blogs</h2>
      <p>{user.name} logged in</p>
      <button onClick={handleLogout}>logout</button>

      <Togglable buttonLabel="new blog">
        <BlogForm createBlog={createBlog} />
      </Togglable>
      {blogs.map((blog) => (
          <Blog
            key={blog.id}
            blog={blog}
            handleLikes={handleLikes}
            deleteBlog={deleteBlog}
            showRemove={blog.user.name === user.name}
          />
      ))}
    </div>
  )
}

export default App
