import { combineReducers } from 'redux';
import { SET_CURRENT_TRACK } from './actions';

function currentTrack(state = null, action) {
  switch(action.type) {
    case SET_CURRENT_TRACK:
      return action.track;
    default:
      return state;
  }
}

export default combineReducers({
  currentTrack
});