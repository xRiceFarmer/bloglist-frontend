import { useState } from 'react'
import { Form, Button } from 'react-bootstrap'
const BlogForm = ({ createBlog }) => {
  const [title, setTitle] = useState('')
  const [author, setAuthor] = useState('')
  const [url, setUrl] = useState('')

  const addBlog = (event) => {
    event.preventDefault()
    createBlog({
      title: title,
      author: author,
      url: url
    })
    setAuthor('')
    setTitle('')
    setUrl('')
  }

  return (
    <div>
      <h2>create new</h2>
      <Form onSubmit={addBlog}>
        <Form.Group>
          <Form.Label>
          Title:
          </Form.Label>
          <Form.Control
            type="text"
            data-testid='title'
            value={title}
            name="Title"
            placeholder='Title'
            onChange={({ target }) => setTitle(target.value)}
          />
        </Form.Group>
        <Form.Group>
          <Form.Label>
          Author:
          </Form.Label>
          <Form.Control
            type="text"
            data-testid='author'
            value={author}
            name="Author"
            placeholder='Author'
            onChange={({ target }) => setAuthor(target.value)}
          />
        </Form.Group>
        <Form.Group>
          <Form.Label>
          URL:
          </Form.Label>
          <Form.Control
            type="text"
            data-testid='url'
            value={url}
            name="URL"
            placeholder='URL'
            onChange={({ target }) => setUrl(target.value)}
          />
        </Form.Group>
        <Button variant="primary" type="submit" name="create">create</Button>
      </Form>
    </div>
  )
}

export default BlogForm
