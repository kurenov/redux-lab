/**
 * Created by Olzhas on 6/25/2017.
 */

export const loadState = () => {
   try {
     const serializedState = localStorage.getItem('state');
     if (serializedState) {
       return JSON.parse(serializedState);
     }
     return undefined;
   } catch (err) {
     console.log('Error while loading state', err.message);
     return undefined;
   }
};

export const saveState = (state) => {
  try {
    const serializedState = JSON.stringify(state);
    if (serializedState) {
      localStorage.setItem('state', serializedState);
    }
  } catch (err) {
    console.log('Error while loading state', err.message);
  }
};