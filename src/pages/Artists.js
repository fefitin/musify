import React from 'react';
import LazyList from '../components/LazyList';
import ArtistModel from '../models/ArtistModel';
import ArtistLazyListItem from '../components/ArtistLazyListItem';

export default function Artists(props) {
  const fetch = function(skip, size) {
    return new Promise((resolve, reject) => {
      ArtistModel.list(skip, size).then(data => resolve(data.artists)).catch(reject);
    });
  };

  return (
    <div id="artists">
      <header>
        <h1>Artists</h1>
      </header>
      
      <div className="content">
        <LazyList fetch={fetch} children={ArtistLazyListItem} />
      </div>
    </div>
  );
}