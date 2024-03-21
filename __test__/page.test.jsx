import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import JunheeTest from '../src/app/junhee-test/page';

describe('Page', () => {
  it('renders a heading', () => {
    render(<JunheeTest />);

    const heading = screen.getByRole('heading', { level: 1 });

    expect(heading).toBeInTheDocument();
  });
});
