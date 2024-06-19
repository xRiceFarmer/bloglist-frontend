import { useState, useEffect } from 'react'
import Blog from './components/Blog'
import blogService from './services/blogs'
import loginService from './services/login'
import Notification from './components/Notification'
import Togglable from './components/Togglable'
import BlogForm from './components/BlogForm'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useNotification } from './contexts/NotificationContext'

import { useUser } from './contexts/UserContext'

import UserList from './components/UserList'

import { Routes, Route, Link, useMatch, useNavigate } from 'react-router-dom'

const App = () => {
  const [notification, setNotification] = useNotification()
  const { state, dispatch } = useUser()
  const { user, username, password } = state
  const [comment, setComment] = useState('')
  const navigate = useNavigate()

  const queryClient = useQueryClient()

  const newBlogMutation = useMutation({
    mutationFn: blogService.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['blogs'] })
    }
  })

  const {
    data: blogs,
    isLoading,
    isError
  } = useQuery({
    queryKey: ['blogs'],
    queryFn: async () => {
      const blogs = await blogService.getAll()
      return blogs.sort((a, b) => b.likes - a.likes)
    }
  })

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBlogUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      dispatch({ type: 'SET_USER', payload: user })
      blogService.setToken(user.token)
    }
  }, [dispatch])

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
  const addCommentMutation = useMutation({
    mutationFn: async ({ id, comment }) => {
      return await blogService.addComment(id, comment)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['blogs'] })
    }
  })
  const handleComment = async (event, id) => {
    event.preventDefault()
    try {
      await addCommentMutation.mutateAsync({ id, comment })
      setComment('')
      console.log(blogs)
    } catch (error) {
      const messageObject = {
        text: 'Error adding comment',
        type: 'error'
      }
      setNotification(messageObject)
    }
  }

  const handleLogout = (event) => {
    window.localStorage.removeItem('loggedBlogUser')
    dispatch({ type: 'CLEAR_USER' })
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
            onChange={({ target }) =>
              dispatch({ type: 'SET_USERNAME', payload: target.value })
            }
          />
        </div>
        <div>
          password
          <input
            data-testid="password"
            type="password"
            value={password}
            name="Password"
            onChange={({ target }) =>
              dispatch({ type: 'SET_PASSWORD', payload: target.value })
            }
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
      queryClient.invalidateQueries({ queryKey: ['blogs'] })
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
        queryClient.invalidateQueries({ queryKey: ['blogs'] })
        navigate('/')
        setNotification({
          text: `Blog ${blogToDelete.title} deleted`,
          type: 'success'
        })
      } catch (error) {
        setNotification({ text: error.message, type: 'error' })
      }
    }
  }

  const match = useMatch('/blogs/:id')
  const blog = match ? blogs?.find((blog) => blog.id === match.params.id) : null

  if (!user) {
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
      <nav>
        <Link to="/">Home</Link>
        <Link to="/users">Users</Link>
        {user && (
          <div>
            <p>{user.name} logged in</p>
            <button onClick={handleLogout}>logout</button>
          </div>
        )}
      </nav>
      <Notification message={notification} />
      <h2>blogs app</h2>
      <Routes>
        <Route path="/users/*" element={<UserList />} />
        <Route
          path="/"
          element={
            <>
              <Togglable buttonLabel="new blog">
                <BlogForm createBlog={createBlog} />
              </Togglable>
              {blogs && blogs.map((blog) => <Blog key={blog.id} blog={blog} />)}
            </>
          }
        />
        <Route
          path="/blogs/:id"
          element={
            blog && (
              <>
                <h1>
                  {blog.title} by {blog.author}
                </h1>
                <div>{blog.url}</div>
                <div>
                  likes {blog.likes}
                  <button name="like" onClick={() => handleLikes(blog.id)}>
                    like
                  </button>
                </div>
                {blog.user.name === user.name && (
                  <button name="remove" onClick={() => deleteBlog(blog.id)}>
                    remove
                  </button>
                )}
                <div>
                  {blog.user ? (
                    <>
                      <div>added by {blog.user.name}</div>
                    </>
                  ) : (
                    <p>No user information available</p>
                  )}
                </div>
                <h2>comments</h2>
                <form onSubmit={(event) => handleComment(event, blog.id)}>
                  <input
                    name="comment"
                    value={comment}
                    onChange={({ target }) => setComment(target.value)}
                  />
                  <button type="submit">add comment</button>
                </form>
                <ul>
                  {blog.comments &&
                    blog.comments.map((comment, index) => (
                      <li key={index}>{comment}</li>
                    ))}
                </ul>
              </>
            )
          }
        />
      </Routes>
    </div>
  )
}

export default App
