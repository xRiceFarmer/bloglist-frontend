import { render, screen } from '@testing-library/react'
import BlogForm from './BlogForm'
import userEvent from '@testing-library/user-event'

test('<BlogForm/> updates parent state and calls onSubmit', async () => {
    const createBlog = vi.fn()
    const user = userEvent.setup()

    render(<BlogForm createBlog={createBlog}/>)

    const titleInput = screen.getByPlaceholderText('Title')
    const authorInput = screen.getByPlaceholderText('Author')
    const urlInput = screen.getByPlaceholderText('URL')

    const sendButton = screen.getByText('create')

    await user.type(titleInput, '1Q84')
    await user.type(authorInput, 'murakami')
    await user.type(urlInput, 'anna-archives.com')

    await user.click(sendButton)

    expect(createBlog.mock.calls).toHaveLength(1)
    expect(createBlog.mock.calls[0][0]).toEqual({
        title: '1Q84',
        author: 'murakami',
        url: 'anna-archives.com'
    })
    console.log(createBlog.mock.calls)
})