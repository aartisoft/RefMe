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