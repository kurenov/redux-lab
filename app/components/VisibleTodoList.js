/**
 * Created by FireFly on 6/25/2017.
 */
import React from 'react';
import { connect } from 'react-redux';

const toggleTodo = (id) => ({
  type: 'TOGGLE_TODO',
  id
});

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

export default VisibleTodoList;