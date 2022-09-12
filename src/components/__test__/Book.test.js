import { screen, render, cleanup, fireEvent } from '@testing-library/react';
import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { store } from '../../store.ts';
import BookDetails from '../Book/Book.tsx';
import '@testing-library/jest-dom/extend-expect';

const Book = {
  _id: '123456789',
  title: 'title',
  author: 'author',
  image: 'image',
  year: '1988',
  category: 'classics',
  description: `Lorem ipsum dolor sit amet`,
};

const showRatingDialog = jest.fn(() => null);
const showReviewDialog = jest.fn(() => null);
const close = jest.fn(() => null);

const setup = (book) => {
  render(
    <Provider store={store}>
      <BookDetails
        book={book}
        open
        bookReviews={[]}
        showRatingDialog={showRatingDialog}
        showReviewDialog={showReviewDialog}
        close={close}
      />
    </Provider>
  );
};

afterEach(() => cleanup());

describe('Book', () => {
  it('renders without crashing', () => {
    const div = document.createElement('div');
    ReactDOM.render(
      <Provider store={store}>
        <BookDetails book={Book} />
      </Provider>,
      div
    );
  });
  it(`renders book's image if it is available`, () => {
    setup(Book);

    expect(screen.getByTestId('book-image')).toBeInTheDocument();
  });
  it('renders a placeholder image if book image not available', () => {
    setup({});

    expect(screen.getByTestId('book-image')).toBeInTheDocument();
    expect(screen.getByTestId('book-image')).toHaveAttribute('src', 'edition_placeholder2.png');
  });
  it('renders Loading component if book details are not available', () => {
    render(
      <Provider store={store}>
        <BookDetails loading open />
      </Provider>
    );

    expect(screen.getByTestId('loading')).toBeInTheDocument();
  });
  it(`renders book's title`, () => {
    setup(Book);

    expect(screen.getByTestId('book-title')).toBeInTheDocument();
    expect(screen.getByTestId('book-title').textContent).toBe('title');
  });
  it('renders icon for rating the book', () => {
    setup(Book);

    expect(screen.getByTestId('rate-book-icon')).toBeInTheDocument();
  });
  it('renders rating dialog when rating icon is clicked', () => {
    setup(Book);

    const rateIcon = screen.getByTestId('rate-book-icon');
    fireEvent.click(rateIcon);
    expect(showRatingDialog).toHaveBeenCalledTimes(1);
  });
  it('renders icon for reviewing the book', () => {
    setup(Book);

    expect(screen.getByTestId('review-book-icon')).toBeInTheDocument();
  });
  it('renders review dialog when review icon is clicked', () => {
    setup(Book);

    const reviewIcon = screen.getByTestId('review-book-icon');
    fireEvent.click(reviewIcon);
    expect(showReviewDialog).toHaveBeenCalledTimes(1);
  });
  it(`renders book's author`, () => {
    setup(Book);

    expect(screen.getByTestId('book-author')).toBeInTheDocument();
    expect(screen.getByTestId('book-author').textContent).toBe('by author');
  });
  it(`renders book's category`, () => {
    setup(Book);

    expect(screen.getByTestId('book-category')).toBeInTheDocument();
    expect(screen.getByTestId('book-category').textContent).toBe('Category: classics');
  });
  it(`renders ReviewsContainer with book's rating and reviews`, () => {
    setup(Book);

    expect(screen.getByTestId('reviews-container')).toBeInTheDocument();
  });
  it(`renders book's description with title 'About -book title-`, () => {
    setup(Book);

    expect(screen.getByTestId('description-title')).toBeInTheDocument();
    expect(screen.getByTestId('description-title').textContent).toBe('About title');
    expect(screen.getByTestId('description-text')).toBeInTheDocument();
    expect(screen.getByTestId('description-text').textContent).toBe(`Lorem ipsum dolor sit amet`);
  });
  it('renders Back button for closing the dialog', () => {
    setup(Book);

    const backButton = screen.getByTestId('back-button');
    expect(backButton).toBeInTheDocument();
  });
  it('closes the BookDetails dialog when Back button is clicked', () => {
    setup(Book);

    const backButton = screen.getByTestId('back-button');
    fireEvent.click(backButton);
    expect(close).toHaveBeenCalledTimes(1);
  });
});
