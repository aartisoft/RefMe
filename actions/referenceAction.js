import * as actionTypes from './actionTypes'

var currentId = 0

export const addReference = (ref) => ({
	ref,
	type: actionTypes.ADD_REFERENCE,
})

export const removeReference = (ref) => ({
	ref,
	type: actionTypes.REMOVE_REFERENCE,
})

export const updateDocument = (id, doc) => ({
	id,
	doc,
	type: actionTypes.UPDATE_DOCUMENT,
})

export const uploadMissingDocument = (id, doc) => ({
	id,
	doc,
	type: actionTypes.UPLOAD_MISSING_DOCUMENT,
})

export const enableProFeatures = () => ({
	type: actionTypes.ENABLE_PRO_FEATURES,
})












/** DEBUGGING ONLY **/
export const resetState = () => ({
	type: actionTypes.RESET_STATE,
})