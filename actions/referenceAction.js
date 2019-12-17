import * as actionTypes from './actionTypes'

var currentId = 0

export const addReference = (ref) => ({
	ref,
	id: currentId++,
	type: actionTypes.CREATE_NEW_REFERENCE,
})