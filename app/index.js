/**
 * Created by Olzhas on 6/24/2017.
 */

import React from 'react';
import { createStore, combineReducers } from 'redux';
import { connect, Provider } from 'react-redux';
import ReactDOM from 'react-dom';

// helper functions
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

// Action Creators
let todoId = 0;
const addTodo = (text) => {
  return {
    type: 'ADD_TODO',
    text: text,
    id: todoId++
  };
};

const setVisibilityFilter = (filter) => {
  return {
    type: 'SET_VISIBILITY_FILTER',
    filter: filter
  };
};

const toggleTodo = (id) => {
  return {
    type: 'TOGGLE_TODO',
    id
  };
};

// presentational (functional) and class components
const Link = ({ children, active, onClick }) => {
  if (active) {
    return <span>{children}</span>;
  }
  return (
    <a
      href="#"
      onClick={(e) => {
        e.preventDefault();
        onClick();
      }}
    >
      {children}
    </a>
  );
};

const mapStateToLinkProps = (state, ownProps) => {
  return {
    active: ownProps.filter === state.visibilityFilter
  }
};

const mapDispatchToLinkProps = (dispatch, ownProps) => {
  return {
    onClick() {
      dispatch(setVisibilityFilter(ownProps.filter));
    }
  }
};

const FilterLink = connect(mapStateToLinkProps, mapDispatchToLinkProps)(Link);

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

// class VisibleTodoList extends React.Component {
//   componentDidMount() {
//     const { store } = this.context;
//     this.unsubscribe = store.subscribe(() => this.forceUpdate());
//   }
//
//   componentWillUnmount() {
//     this.unsubscribe();
//   }
//   render() {
//     // const props = this.props;
//     const { store } = this.context;
//     const state = store.getState();
//
//     return (
//       <TodoList
//         todos={
//           getVisibleTodos(state.todos, state.visibilityFilter)
//         }
//         onTodoClick={(id) => {
//           store.dispatch({
//             type: 'TOGGLE_TODO',
//             id
//           })
//         }}
//       />
//     );
//   }
// }
// VisibleTodoList.contextTypes = {
//   store: React.PropTypes.object
// };

// Provider maps
// 1 - State dependent props
// 2 - dispatch related props (functions)
const mapStateToTodoListProps = (state) => {
  return {
    todos: getVisibleTodos(state.todos, state.visibilityFilter)
  }
};

const mapDispatchToTodoListProps = (dispatch) => {
  return {
    onTodoClick(id) {
      dispatch(toggleTodo(id));
    }
  }
};

const VisibleTodoList = connect(mapStateToTodoListProps, mapDispatchToTodoListProps)(TodoList);

let AddTodo = ({ dispatch }) => {
  let input;
  return (<div>
    <input
      type="text"
      ref={(node) => {
        input = node;
      }}
    />
    <button
      onClick={() => {
        dispatch(addTodo(input.value));
        input.value = '';
      }}
    >
      Add Todo
    </button>
  </div>);
};
AddTodo = connect()(AddTodo);

const Footer = ({ store }) => {
  return (<p>
    Show:
    {' '}
    <FilterLink
      filter='SHOW_ALL'
    >
      All
    </FilterLink>
    {' '}
    <FilterLink
      filter='SHOW_ACTIVE'
    >
      Active
    </FilterLink>
    {' '}
    <FilterLink
      filter='SHOW_COMPLETED'
    >
      Completed
    </FilterLink>
  </p>);
};

const TodoApp = ({ store }) => (
  <div>
    <AddTodo/>
    <VisibleTodoList/>
    <Footer/>
  </div>
);

ReactDOM.render(
  <Provider store={createStore(todoApp)}>
    <TodoApp/>
  </Provider>,
  document.getElementById('root')
);