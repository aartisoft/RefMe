import * as actionTypes from '../actions/actionTypes';

export const initialReferencesState = {
  ids: []
}

export default (state = initialReferencesState, action = null) => {
    switch (action.type) {
      case actionTypes.ADD_REFERENCE: {
        const { ref } = action
        console.log("referenceReducer.addReference: " + ref)
        console.log("references: ")
        console.log(state)

        return {
          ...state,
          ids: [...state.ids, ref + ""],
        }
      }

      case actionTypes.REMOVE_REFERENCE: {
        const { ref } = action
        console.log("referenceReducer.removeReference: " + ref)
        console.log("references: ")
        console.log(state)

        const location = state.ids.indexOf(ref+"")
        console.log("location: " + location)
        state.ids.splice(location, 1)
        console.log(state.ids)

        return {
          ...state,
          ids: state.ids,
        }
      }

      default: {
        return state;
      }
    }
  };