import Togglable from "./Togglable";
const Blog = ({ blog }) => {
  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: "solid",
    borderWidth: 1,
    marginBottom: 5,
  };
  return (
    <div style={blogStyle}>
      {blog.title} {blog.author}
      <Togglable buttonLabel="view">
        <div>{blog.url}</div>
        <div> likes {blog.likes}</div>
        <div>
          {blog.user ? (
            <>
              <p>Username: {blog.user.username}</p>
              <p>Name: {blog.user.name}</p>
            </>
          ) : (
            <p>No user information available</p>
          )}
        </div>
      </Togglable>
    </div>
  );
};
export default Blog;
