/* eslint-disable no-console */
import { screen, render, cleanup } from '@testing-library/react';
import React from 'react';
import ReactDOM from 'react-dom';
import ReviewsContainer from '../Review/ReviewsContainer.tsx';
import '@testing-library/jest-dom/extend-expect';

const reviews = [
  {
    _id: 1,
    userId: '123456789',
    review: 'test review',
    timestamp: '2022-07-02',
  },
  {
    _id: 2,
    userId: '987654321',
    review: 'test review 2',
    timestamp: '2022-07-03',
  },
];

const setup = (revs) => {
  render(<ReviewsContainer reviews={revs} />);
};

afterEach(() => cleanup());

describe('ReviewsContainer', () => {
  it('renders without crashing', () => {
    const div = document.createElement('div');
    ReactDOM.render(<ReviewsContainer reviews={reviews} />, div);
  });
  it(`renders book's rating and number of reviews`, () => {
    setup(reviews);

    expect(screen.getByTestId('rating')).toBeInTheDocument();
    expect(screen.getByTestId('review-numb')).toBeInTheDocument();
    expect(screen.getByTestId('review-numb').textContent).toBe(`Reviews (2)`);
  });
  it('renders reviews if there are any', () => {
    setup(reviews);

    expect(screen.getAllByTestId('review-card')).toHaveLength(2);
  });
  it(`renders 'Be the first to review this book.' if there are no reviews`, () => {
    setup([]);

    expect(screen.getByTestId('no-reviews-message')).toBeInTheDocument();
    expect(screen.getByTestId('no-reviews-message').textContent).toBe(
      'Be the first to review this book.'
    );
  });
});
