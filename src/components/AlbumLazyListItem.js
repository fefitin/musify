import React from 'react';
import { NavLink } from 'react-router-dom';
import styles from './../css/LazyList.module.scss';

export default function AlbumLazyListItem(props) {
  return (
    <NavLink to={props.data.url}>
      <div className={styles.image}>
        <img src={props.data.image} alt={props.data.name} />
      </div>
      <p className={styles.name}>{props.data.name}</p>
    </NavLink>
  );
}