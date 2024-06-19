import { useQuery } from '@tanstack/react-query'
import userService from '../services/users'
import { Routes, Route, Link, useMatch } from 'react-router-dom'

const User = ({ user }) => {
  if (!user) return <div>User not found</div>
  return (
    <div>
      <h1>{user.name}</h1>
      <h2>Added blogs</h2>
      <ul>
        {user.blogs.map((blog) => (
          <li key={blog.id}>{blog.title}</li>
        ))}
      </ul>
    </div>
  )
}

const UserList = () => {
  const {
    data: users,
    isLoading,
    isError
  } = useQuery({
    queryKey: ['users'],
    queryFn: userService.getAll
  })

  const match = useMatch('/users/:id')
  const user = match ? users?.find((user) => user.id === match.params.id) : null

  if (isLoading) {
    return <div>Loading...</div>
  }
  if (isError) {
    return <div>Error fetching users</div>
  }

  return (
    <div>
      <Routes>
        <Route
          path=""
          element={
            <>
              <h2>Users</h2>
              <table>
                <thead>
                  <tr>
                    <th>Username</th>
                    <th>Blogs</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((user) => (
                    <tr key={user.id}>
                      <td>
                        <Link to={`/users/${user.id}`}>{user.username}</Link>
                      </td>
                      <td>{user.blogs.length}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </>
          }
        />

        <Route path="/:id" element={<User user={user} />} />
      </Routes>
    </div>
  )
}

export default UserList
