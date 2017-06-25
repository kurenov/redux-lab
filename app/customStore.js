/**
 * Created by Olzhas on 6/24/2017.
 */
const createCustomStore = (reducer) => {
  let state;
  const subscribers = [];
  const getState = () => state;
  const subscribe = subscriber => subscribers.push(subscriber);
  const dispatch = (action) => {
    state = reducer(state, action);
    subscribers.forEach(subscriber => subscriber());
  };

  return {
    subscribe,
    dispatch,
    getState
  }
};
export default createCustomStore;
