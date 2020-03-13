import React from 'react';
import LazyList from '../components/LazyList';
import TrackModel from '../models/TrackModel';
import TrackLazyListItem from '../components/TrackLazyListItem';

export default function Albums(props) {
  const fetch = function(skip, size) {
    return new Promise((resolve, reject) => {
      TrackModel.list(skip, size).then(data => resolve(data.tracks)).catch(reject);
    });
  };

  return (
    <div id="albums">
      <header>
        <h1>Tracks</h1>
      </header>
      <div className="content">
        <LazyList fetch={fetch} children={TrackLazyListItem} className="tracks" />
      </div>
    </div>
  );
}