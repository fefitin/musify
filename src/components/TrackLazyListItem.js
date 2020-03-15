import React from 'react';
import styles from './../css/LazyList.module.scss';

export default function TrackLazyListItem(props) {
  return (
    <a href={props.data.url} className={`${styles.track} ${props.active ? styles.active : ''}`} onClick={props.onClick}>
      <span className={styles.no}>{props.data.track}</span>
      <span className={styles.name}>{props.data.title}</span>
      <span className={styles.album}>{props.data.artist}</span>
      <span className={styles.artist}>{props.data.album}</span>
      <span className={styles.length}>{new Date(props.data.length * 1000).toISOString().substr(14, 5)}</span>
    </a>
  );
}