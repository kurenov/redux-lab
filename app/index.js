/**
 * Created by Olzhas on 6/24/2017.
 */

import React from 'react';
import { createStore, combineReducers } from 'redux';
import ReactDOM from 'react-dom';

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
      console.log('state', state);
      if (state.id === action.id) {
        return {
          ...state,
          completed: !state.completed
        }
      }
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

const visibilityFilter = (state = 'SHOW_ALL', action) => {
  // return {...state, action.filter || 'SHOW_ALL';
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

const todoApp = combineReducers({
  todos,
  visibilityFilter
});
const store = createStore(todoApp);

const Counter = ({value, increment}) => {
  return (
    <div>
      <h1>{value}</h1>
      <button onClick={increment}>+</button>
    </div>
  );
};

const FilterLink = ({ filter, children, currentFilter, onClick }) => {
  if (currentFilter === filter) {
    return <span>{children}</span>;
  }
  return (
    <a
      href="#"
      onClick={(e) => {
        e.preventDefault();
        onClick(filter);
      }}
    >
      {children}
    </a>
  );
};

const Todo = ({ onClick, text, completed }) => {
  return (<li
    onClick={onClick}
    style={{
      textDecoration: completed ? 'line-through' : 'none'
    }}
  >
    {text}
  </li>);
};

const TodoList = ({todos, onTodoClick}) => {
  return (
    <ul>
      {todos.map((todo) => {
        return (
          <Todo
            key={todo.id}
            text={todo.text}
            completed={todo.completed}
            onClick={() => onTodoClick(todo.id)}
          />);
      })}
    </ul>
  );
};

const AddTodo = ({ onAddClick }) => {
  let input;
  return (<div>
    <input
      type="text"
      ref={(node) => {
        input = node;
      }}
    />
    <button onClick={() => {
      onAddClick(input.value);
      input.value = '';
    }}>
      Add Todo
    </button>
  </div>);
};

const Footer = ({ visibilityFilter, onFilterClick }) => {
  return (<p>
    Show:
    {' '}
    <FilterLink
      filter='SHOW_ALL'
      onClick={onFilterClick}
      currentFilter={visibilityFilter}
    >
      All
    </FilterLink>
    {' '}
    <FilterLink
      filter='SHOW_ACTIVE'
      onClick={onFilterClick}
      currentFilter={visibilityFilter}
    >
      Active
    </FilterLink>
    {' '}
    <FilterLink
      filter='SHOW_COMPLETED'
      onClick={onFilterClick}
      currentFilter={visibilityFilter}
    >
      Completed
    </FilterLink>
  </p>);
};

const getVisibleTodos = (todos, filter) => {
  switch (filter) {
    case 'SHOW_ALL':
      return todos;
    case 'SHOW_ACTIVE':
      return todos.filter((t) => !t.completed);
    case 'SHOW_COMPLETED':
      return todos.filter((t) => t.completed);
  }
};

let todoId = 0;

class TodoApp = ({ todos, visibilityFilter }) => (
  <div>
    <AddTodo
      onAddClick={text =>
        store.dispatch({
          type: 'ADD_TODO',
          text: text,
          id: todoId++
        })
      }
    />
    <TodoList
      todos={getVisibleTodos(todos, visibilityFilter)}
      onTodoClick={(id) => {
        store.dispatch({
          type: 'TOGGLE_TODO',
          id
        });
      }}
    />
    <Footer
      visibilityFilter={visibilityFilter}
      onFilterClick={(filter) =>
        store.dispatch({
        type: 'SET_VISIBILITY_FILTER',
        filter
      })}
    />
  </div>
)


const render = () => {
  console.log('store', store.getState());
  ReactDOM.render(
    <TodoApp
      {...store.getState()}
    />,
    document.getElementById('root')
  );
};

store.subscribe(render);
render();