import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import App from '../src/App';

test('renders the main app component', () => {
  render(<App />);
  const linkElement = screen.getByText(/MindSync/i);
  expect(linkElement).toBeInTheDocument();
});
