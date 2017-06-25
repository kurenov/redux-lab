/**
 * Created by Olzhas on 6/24/2017.
 */

import React from 'react';
import { createStore } from 'redux';
import { Provider } from 'react-redux';
import ReactDOM from 'react-dom';
import throttle from 'lodash/throttle';

import todoApp from './reducers/';
import { loadState, saveState } from './localStorage';
import App from './components/App';

const persistedState = loadState();
const store = createStore(todoApp, persistedState);
store.subscribe(throttle(() => {
  saveState({
    todos: store.getState().todos
  });
}, 1000));

ReactDOM.render(
  <Provider store={store}>
    <App/>
  </Provider>,
  document.getElementById('root')
);