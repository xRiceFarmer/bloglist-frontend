import { Link } from 'react-router-dom'
const Blog = ({ blog }) => {
  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5
  }
  return (
    <div>
      <div style={blogStyle} className="blog-container">
        <div className="title">
          <Link to={`/blogs/${blog.id}`}>
            {blog.title} by {blog.author}
          </Link>
        </div>
      </div>
    </div>
  )
}
export default Blog
