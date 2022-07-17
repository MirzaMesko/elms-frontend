import React from 'react';
import ReactDOM from 'react-dom';
// import { createStore, applyMiddleware } from 'redux';
import { Provider } from 'react-redux';
// import thunk from 'redux-thunk';
import './index.css';
import { BrowserRouter } from 'react-router-dom';
// @ts-ignore
import App from './App.tsx';
// import reducer from './reducers/index';
// @ts-ignore
import { store } from './store.ts';

// const store = createStore(reducer, applyMiddleware(thunk));
// // Infer the `RootState` and `AppDispatch` types from the store itself
// // eslint-disable-next-line no-undef
// export type RootState = ReturnType<typeof store.getState>;

ReactDOM.render(
  <React.StrictMode>
    <Provider store={store}>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </Provider>
  </React.StrictMode>,
  document.getElementById('root')
);
