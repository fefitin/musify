import { connect } from 'react-redux';
import { setCurrentTrack } from '../store/actions'
import AlbumTrackLazyListItem from '../components/AlbumTrackLazyListItem';

const mapStateToProps = (state, ownProps) => ({
  data: ownProps.data,
  active: state.currentTrack && ownProps.data._id === state.currentTrack._id
});

const mapDispatchToProps = (dispatch, ownProps) => ({
  onClick: (e) => {
    e.preventDefault();
    dispatch(setCurrentTrack(ownProps.data))
  }
});

export default connect(mapStateToProps, mapDispatchToProps)(AlbumTrackLazyListItem);
