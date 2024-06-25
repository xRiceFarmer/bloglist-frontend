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
    <div style={blogStyle} className='blog-container'>
      <div className='title'>{blog.title}</div>
      <div className='author'>{blog.author}</div>
      <Togglable buttonLabel="view">
        <div>{blog.url}</div>
        <div>
          likes {blog.likes}
          <button name='like' onClick={() => handleLikes(blog.id)}>like</button>
        </div>
        {showRemove && (
          <button name='remove' onClick={() => deleteBlog(blog.id)}>remove</button>
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
