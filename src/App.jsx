import { useState, useEffect } from "react";
import Blog from "./components/Blog";
import blogService from "./services/blogs";
import loginService from "./services/login";
import Notification from "./components/Notification";
import Togglable from "./components/Togglable";
import BlogForm from "./components/BlogForm";

const App = () => {
  const [blogs, setBlogs] = useState([]);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [user, setUser] = useState(null);
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [url, setUrl] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    blogService.getAll().then((blogs) => setBlogs(blogs));
  }, []);
  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem("loggedBlogUser");
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON);
      setUser(user);
      blogService.setToken(user.token);
    }
  }, []);

  const handleLogin = async (event) => {
    event.preventDefault();
    try {
      const user = await loginService.login({ username, password });
      window.localStorage.setItem("loggedBlogUser", JSON.stringify(user));
      blogService.setToken(user.token);
      setUser(user);
      setUsername("");
      setPassword("");
    } catch (error) {
      const messageObject = {
        text: "Wrong username or password",
        type: "error",
      };
      setMessage(messageObject);
      setTimeout(() => {
        setMessage(null);
      }, 5000);
    }
  };
  const handleLogout = (event) => {
    window.localStorage.removeItem("loggedBlogUser");
    setUser(null);
  };
  const createBlog = async (event) => {
    event.preventDefault();
    const blogObject = {
      title: title,
      author: author,
      url: url,
    };
    try {
      const response = await blogService.create(blogObject);
      setBlogs(blogs.concat(response));
      const messageObject = {
        text: `a new blog ${title} by ${author} added`,
        type: "success",
      };
      setMessage(messageObject);
      setTimeout(() => {
        setMessage(null);
      }, 5000);
      setAuthor("");
      setTitle("");
      setUrl("");
    } catch (error) {
      const messageObject = {
        text: error.message,
        type: "error",
      };
      setMessage(messageObject);
      setTimeout(() => {
        setMessage(null);
      }, 5000);
    }
  };
  const loginForm = () => (
    <div>
      <Notification message={message} />

      <form onSubmit={handleLogin}>
        <div>
          username
          <input
            type="text"
            value={username}
            name="Username"
            onChange={({ target }) => setUsername(target.value)}
          />
        </div>
        <div>
          password
          <input
            type="password"
            value={password}
            name="Password"
            onChange={({ target }) => setPassword(target.value)}
          />
        </div>
        <button type="submit">login</button>
      </form>
    </div>
  );
  if (user === null) {
    return loginForm();
  }
  return (
    <div>
      <Notification message={message} />
      <h2>blogs</h2>
      <p>{user.name} logged in</p>
      <button onClick={handleLogout}>logout</button>
      
      <Togglable buttonLabel = 'new blog'>
        <BlogForm
        createBlog={createBlog}
        author={author}
        setAuthor={setAuthor}
        title={title}
        setTitle={setTitle}
        url={url}
        setUrl={setUrl}
        />
      </Togglable>
      {blogs.map((blog) => (
        <Blog key={blog.id} blog={blog} />
      ))}
    </div>
  );
};

export default App;
