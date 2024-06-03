import { render, screen } from '@testing-library/react'
import Blog from './Blog'
import { beforeEach, expect } from 'vitest'
import userEvent from '@testing-library/user-event'

let container
let mockHandler
beforeEach(() => {
  const blog = {
    title: 'norwegian woods',
    author: 'murakami',
    url: 'zlibrary.se',
    likes: 5
  }
  mockHandler = vi.fn()
  const deleteBlog = vi.fn()
  const showRemove = true

  container = render(<Blog blog={blog} handleLikes={mockHandler} />).container
})
test('renders content', () => {
  screen.debug()
  const titleElement = screen.getByText('norwegian woods')
  const authorElement = screen.getByText('murakami')

  expect(titleElement).toBeDefined()
  expect(authorElement).toBeDefined()
  const div = container.querySelector('.togglableContent')
  expect(div).toHaveStyle('display: none')
})

test('addtional info shows when button clicked', async () => {
  const user = userEvent.setup()
  const button = screen.getByText('view')
  await user.click(button)
  const div = container.querySelector('.togglableContent')
  expect(div).not.toHaveStyle('display: none')
})

test('event handler called twice when like button is clicked twice', async () => {
  const user = userEvent.setup()
  const viewButton = screen.getByText('view')
  await user.click(viewButton)
  const button = screen.getByText('like')
  await user.click(button)
  await user.click(button)
  expect(mockHandler.mock.calls).toHaveLength(2)
})
