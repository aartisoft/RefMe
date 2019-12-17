import { combineReducers } from 'redux';
import references from './referenceReducer';

export default combineReducers({
    references: references
});