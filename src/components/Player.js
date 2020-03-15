import React from 'react';

export default function Player(props) {
  return (
    <audio autoPlay controls src={props.currentTrack ? props.currentTrack.url : null}></audio>
  );
}