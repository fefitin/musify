import React from 'react';
import { NavLink } from 'react-router-dom';
import styles from './../css/LazyList.module.scss';

export default function AlbumTrackLazyListItem(props) {
  return (
    <a href={props.data.url} className={styles.track}>
      <span className={styles.no}>{props.data.track}</span>
      <span className={styles.name}>{props.data.title}</span>
      <span className={styles.length}>{new Date(props.data.length * 1000).toISOString().substr(14, 5)}</span>
    </a>
  );
}