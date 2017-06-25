/**
 * Created by Olzhas on 6/24/2017.
 */

import React from 'react';
import { createStore } from 'redux';
import { connect, Provider } from 'react-redux';
import ReactDOM from 'react-dom';

import todoApp from './reducers/';

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

// Action Creators
let todoId = 0;
const addTodo = (text) => ({
  type: 'ADD_TODO',
  text: text,
  id: todoId++
});

const setVisibilityFilter = (filter) => ({
  type: 'SET_VISIBILITY_FILTER',
  filter: filter
});

const toggleTodo = (id) => ({
  type: 'TOGGLE_TODO',
  id
});

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

const persistedState = {
  todos: [{
    id: 0,
    text: 'Welcome back',
    completed: false
  }]
};
const store = createStore(todoApp, persistedState);

ReactDOM.render(
  <Provider store={store}>
    <TodoApp/>
  </Provider>,
  document.getElementById('root')
);