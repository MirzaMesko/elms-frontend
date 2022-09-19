import { screen, render, fireEvent, cleanup } from '@testing-library/react';
import React from 'react';
import ReactDOM from 'react-dom';
import Review from '../Review/Review.tsx';
import '@testing-library/jest-dom/extend-expect';

const user1 = [
  {
    _id: '123456789',
    username: 'test',
    image: '34567',
  },
];

const user2 = [
  {
    _id: '987654321',
    username: 'test2',
  },
];
const authUser = 'test';

const review = {
  userId: '123456789',
  review: 'test review',
  timestamp: '2022-07-02',
};

const deleteReviewFn = jest.fn(() => null);

const setup = (users) => {
  render(<Review review={review} users={users} authUser={authUser} onDelete={deleteReviewFn} />);
};

afterEach(() => cleanup());

describe('Review', () => {
  it('renders without crashing', () => {
    const div = document.createElement('div');
    ReactDOM.render(<Review review={review} />, div);
  });
  it(`renders author's image`, () => {
    setup(user1);

    expect(screen.getByTestId('image')).toBeInTheDocument();
  });
  it(`renders author's username`, () => {
    setup(user1);

    expect(screen.getByTestId('username')).toBeInTheDocument();
    expect(screen.getByTestId('username').textContent).toBe('test');
  });
  it(`renders the text of the review`, () => {
    setup(user1);

    expect(screen.getByTestId('review-text')).toBeInTheDocument();
    expect(screen.getByTestId('review-text').textContent).toBe('test review');
  });
  it(`renders timestamp of the review`, () => {
    setup(user1);

    expect(screen.getByTestId('review-timestamp')).toBeInTheDocument();
    expect(screen.getByTestId('review-timestamp').textContent).toBe('2022-07-02');
  });
  it('renders buttons for editing and deleting review only if user is the author', () => {
    setup(user1);

    expect(screen.getByTestId('edit-review')).toBeInTheDocument();
    expect(screen.getByTestId('delete-review')).toBeInTheDocument();
    cleanup();

    setup(user2);
    expect(screen.queryByTestId('edit-review')).not.toBeInTheDocument();
    expect(screen.queryByTestId('delete-review')).not.toBeInTheDocument();
  });
  // it('renders edit review dialogue when edit review button is clicked', () => {
  //   setup(user1);
  //   expect(screen.getByTestId('review-dialog')).toHaveAttribute('show', false);

  //   const editButton = screen.getByTestId('edit-review');
  //   fireEvent.click(editButton);
  //   expect(screen.getByTestId('review-dialog')).toBeInTheDocument();
  // });
  it('deletes review when delete review button is clicked', () => {
    setup(user1);

    expect(screen.getByTestId('review-text').textContent).toBe('test review');
    const deleteButton = screen.getByTestId('delete-review');
    fireEvent.click(deleteButton);
    expect(deleteReviewFn).toHaveBeenCalledTimes(1);
  });
});
