import Togglable from './Togglable'
const Blog = ({ blog, handleLikes, deleteBlog, showRemove }) => {
  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5
  }
  return (
    <div style={blogStyle}>
      <div>{blog.title}</div>
      <div>{blog.author}</div>
      <Togglable buttonLabel="view">
        <div>{blog.url}</div>
        <div>
          likes {blog.likes}
          <button onClick={() => handleLikes(blog.id)}>like</button>
        </div>
        {!showRemove && (
          <button onClick={() => deleteBlog(blog.id)}>remove</button>
        )}
        <div>
          {blog.user ? (
            <>
              <div>{blog.user.name}</div>
            </>
          ) : (
            <p>No user information available</p>
          )}
        </div>
      </Togglable>
    </div>
  )
}
export default Blog
