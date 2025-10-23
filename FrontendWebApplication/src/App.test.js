import { render, screen } from '@testing-library/react';
import App from './App';

test('renders app container', () => {
  render(<App />);
  // Assert main navigation title exists on list route
  const heading = screen.getByText(/Devices/i);
  expect(heading).toBeInTheDocument();
});
