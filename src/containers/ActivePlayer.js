import { connect } from 'react-redux';
import Player from '../components/Player';

const mapStateToProps = (state, ownProps) => ({
  currentTrack: state.currentTrack
});

export default connect(mapStateToProps)(Player);
