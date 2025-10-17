import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import App from '../App'

test('renders header and can add quick transaction', ()=>{
  render(<App />)
  expect(screen.getByText(/LumenLedger/)).toBeInTheDocument()
  const desc = screen.getByPlaceholderText(/Description or quick/i)
  fireEvent.change(desc, { target: { value: 'Test -5' } })
  const addBtn = screen.getByText(/Add transaction|Add/i)
  fireEvent.click(addBtn)
  expect(screen.getByText(/Test/)).toBeInTheDocument()
})
