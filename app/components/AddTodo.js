/**
 * Created by Olzhas on 6/25/2017.
 */
import React from 'react';
import { connect } from 'react-redux';
import { v4 } from 'node-uuid';

const addTodo = (text) => ({
  type: 'ADD_TODO',
  text: text,
  id: v4()
});

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

export default AddTodo;
