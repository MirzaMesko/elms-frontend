import { screen, render, cleanup } from '@testing-library/react';
import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { store } from '../../store.ts';
import Card from '../Helpers/Card.tsx';
import '@testing-library/jest-dom/extend-expect';

const setup = (message) => {
  render(
    <Provider store={store}>
      <Card title="title" text={message} />
    </Provider>
  );
};

afterEach(() => cleanup());

describe('Card', () => {
  it('renders without crashing', () => {
    const div = document.createElement('div');
    ReactDOM.render(
      <Provider store={store}>
        <Card />
      </Provider>,
      div
    );
  });
  it('renders a title for card', () => {
    setup();

    expect(screen.queryByText('title')).toBeInTheDocument();
  });
  it('renders a message for card', () => {
    setup('message');

    expect(screen.queryByText('message')).toBeInTheDocument();
  });
});
