import * as actionTypes from '../actions/actionTypes';

export const initialReferencesState = {
  ids: [],
  docs: {},
  missing: {},
  user: {
    isPro: false,
  }
}

export default (state = initialReferencesState, action = null) => {
    switch (action.type) {
      case actionTypes.ADD_REFERENCE: {
        const { ref } = action
        console.log("referenceReducer.addReference: " + ref)

        return {
          ...state,
          ids: [...state.ids, ref + ""],
        }
      }

      case actionTypes.REMOVE_REFERENCE: {
        const { ref } = action
        console.log("referenceReducer.removeReference: " + ref)

        const location = state.ids.indexOf(ref+"")
        console.log("location: " + location)
        state.ids.splice(location, 1)
        console.log(state.ids)

        return {
          ...state,
          ids: state.ids,
        }
      }

      case actionTypes.UPDATE_DOCUMENT: {
        const { id, doc } = action
        console.log("referenceReducer.updateDocument: ")

        state.docs[id] = doc
        return state
      }

      case actionTypes.UPLOAD_MISSING_DOCUMENT: {
        const { id, doc } = action
        console.log("referenceReducer.uploadMissingDocument")

        state.missing[id] = doc
        return state
      }

      case actionTypes.REVERT_STATE: {
        console.log("referenceReducer.resetState: should only be used in debugging")
        return initialReferencesState
      }

      case actionTypes.ENABLE_PRO_FEATURES: {
        console.log("referenceReducer.enableProFeatures: user has upgraded to pro")
        return {
          ...state,
          user: {
            ...state.user,
            isPro: true,
          }
        }
      }

      default: {
        return state;
      }
    }
  };