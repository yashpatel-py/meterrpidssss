import { render, screen } from '@testing-library/react';
import App from './App';

test('renders top navigation call-to-action', () => {
  render(<App />);
  const ctaButton = screen.getByText(/get a quote/i);
  expect(ctaButton).toBeInTheDocument();
});
