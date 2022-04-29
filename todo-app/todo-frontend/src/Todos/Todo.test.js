import React from 'react'
import '@testing-library/jest-dom/extend-expect'
import { render, screen } from '@testing-library/react'
import Todo from './Todo'

test('renders todo', () => {
  const todo = {
    text: 'Testing todo!',
    done: false
  }
  const doneInfo = <span>This todo is done</span>
  const notDoneInfo = <span>This todo is not done</span>

  render(<Todo todo={todo} doneInfo={doneInfo} notDoneInfo={notDoneInfo} />)
  const element = screen.getByText('Testing todo!')
  expect(element).toBeDefined()
})