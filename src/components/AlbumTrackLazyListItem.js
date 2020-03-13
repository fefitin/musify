import React from 'react';
import styles from './../css/LazyList.module.scss';

export default function AlbumTrackLazyListItem(props) {

  function setCurrentTrack(url, e) {
    e.preventDefault();
    document.getElementById('audio').src = url;
    document.getElementById('audio').play();
  }

  return (
    <a href={props.data.url} className={styles.track} onClick={(e) => setCurrentTrack(props.data.url, e)}>
      <span className={styles.no}>{props.data.track}</span>
      <span className={styles.name}>{props.data.title}</span>
      <span className={styles.length}>{new Date(props.data.length * 1000).toISOString().substr(14, 5)}</span>
    </a>
  );
}