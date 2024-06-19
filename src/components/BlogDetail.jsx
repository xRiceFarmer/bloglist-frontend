import { useState } from "react"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import blogService from '../services/blogs'

const BlogDetail = ({blog, showRemove, handleLikes, deleteBlog, setNotification}) => {
    const [comment, setComment] = useState('')
    const queryClient = useQueryClient()

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
        } catch (error) {
          const messageObject = {
            text: 'error adding comment',
            type: 'error'
          }
          console.log(error)
          setNotification(messageObject)
        }
      }
    return(
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
        {showRemove && (
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
export default BlogDetail