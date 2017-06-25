/**
 * Created by Olzhas on 6/25/2017.
 */
import { combineReducers } from 'redux';

// reducer function & its compositions
const todo = (state, action) => {
  switch (action.type) {
    case 'ADD_TODO':
      return [
        ...state,
        {
          id: action.id,
          text: action.text,
          completed: false
        }
      ];
    case 'TOGGLE_TODO':
      if (state.id === action.id) {
        return {
          ...state,
          completed: !state.completed
        }
      }
      return state;
  }
};

const visibilityFilter = (state = 'SHOW_ALL', action) => {
  switch (action.filter) {
    case 'SHOW_ALL':
      return 'SHOW_ALL';
    case 'SHOW_ACTIVE':
      return 'SHOW_ACTIVE';
    case 'SHOW_COMPLETED':
      return 'SHOW_COMPLETED';
    default:
      return state;
  }
};

const todos = (state = [], action) => {
  switch (action.type) {
    case 'ADD_TODO':
      return todo(state, action);
    case 'TOGGLE_TODO':
      return state.map((t) => todo(t, action));
    default:
      return state;
  }
};

const todoApp = combineReducers({
  todos,
  visibilityFilter
});

export default todoApp;