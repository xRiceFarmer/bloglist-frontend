import { useState, useEffect } from 'react'
import Blog from './components/Blog'
import blogService from './services/blogs'
import loginService from './services/login'
import Notification from './components/Notification'
import Togglable from './components/Togglable'
import BlogForm from './components/BlogForm'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useNotification } from './contexts/NotificationContext'

const App = () => {
  //const [blogs, setBlogs] = useState([])
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [user, setUser] = useState(null)
  const [notification, setNotification] = useNotification()

  const queryClient = useQueryClient()

  const newBlogMutation = useMutation({
    mutationFn: blogService.create,
    onSuccess: () => {
      queryClient.invalidateQueries({queryKey: ['blogs']})
    }
  })
  
  const {data: blogs, isLoading, isError} = useQuery({
    queryKey: ['blogs'],
    queryFn: async () => {
      const blogs = await blogService.getAll()
      return blogs.sort((a,b) => b.likes - a.likes)
    }
  })

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
      setNotification(messageObject)
    }
  }
  const handleLogout = (event) => {
    window.localStorage.removeItem('loggedBlogUser')
    setUser(null)
  }
  const createBlog = async (blogObject) => {
    try {
      await newBlogMutation.mutateAsync(blogObject)
      const messageObject = {
        text: `a new blog ${blogObject.title} by ${blogObject.author} added`,
        type: 'success'
      }
      setNotification(messageObject)
    } catch (error) {
      const messageObject = {
        text: error.response.data.error,
        type: 'error'
      }
      setNotification(messageObject)
    }
  }
  const loginForm = () => (
    <div>
      <Notification message={notification} />

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
     await blogService.update(id, updatedBlog)
      queryClient.invalidateQueries({queryKey : ['blogs']})
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
        queryClient.invalidateQueries({queryKey : ['blogs']})

        setNotification({
          text: `Blog ${blogToDelete.title} deleted`,
          type: 'success'
        })
      } catch (error) {
        setNotification({ text: error.message, type: 'error' })
      }
    }
  }
  if (user === null) {
    return loginForm()
  }
  if (isLoading) {
    return <div>Loading...</div>
  }

  if (isError) {
    return <div>Error fetching blogs</div>
  }

  return (
    <div>
      <Notification message={notification} />
      <h2>blogs</h2>
      <p>{user.name} logged in</p>
      <button onClick={handleLogout}>logout</button>

      <Togglable buttonLabel="new blog">
        <BlogForm createBlog={createBlog} />
      </Togglable>
      {blogs && blogs.map((blog) => (
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
