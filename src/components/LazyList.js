import React, { useState, useEffect } from 'react';
import styles from './../css/LazyList.module.scss';

export default function LazyList(props) {
  const size = 30;

  const [items, setItems] = useState([]);
  const [skip, setSkip] = useState(0);
  const [loading, setLoading] = useState(false);
  const fetch = props.fetch;

  useEffect(() => {
    setLoading(true);

    fetch(skip, size).then(items => {
      setItems(currentItems => [...currentItems, ...items]);
      setLoading(false);
    });
  }, [ fetch, skip ]);
  
  useEffect(() => {
    const list = document.getElementById('main');
    const loadMore = () => {
      if(!loading && list.scrollTop + list.clientHeight === list.scrollHeight) {
        setSkip(skip + size);
      }
    };

    list.addEventListener('scroll', loadMore); 
  
    return () => {
      list.removeEventListener('scroll', loadMore);
    };
  });

  const listItems = items.map(item => {
    const child = React.createElement(props.children, { data: item });
    return <li key={item._id}>{child}</li>;
  });

  return (<ul className={styles.listing}>{listItems}</ul>)
}