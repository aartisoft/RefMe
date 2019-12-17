import * as actionTypes from '../actions/actionTypes';

export const initialReferencesState = []

export default (state = initialReferencesState, action = null) => {
    switch (action.type) {
      case actionTypes.CREATE_NEW_REFERENCE: {
        console.log(state)
        const { ref } = action
        return state.concat(ref)
      }

      default: {
        return state;
      }
    }
  };