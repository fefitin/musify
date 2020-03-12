import React from 'react';
import LazyList from '../components/LazyList';
import AlbumModel from '../models/AlbumModel';
import AlbumLazyListItem from '../components/AlbumLazyListItem';

export default function Albums(props) {
  const fetch = function(skip, size) {
    return new Promise((resolve, reject) => {
      AlbumModel.list(skip, size).then(data => resolve(data.albums)).catch(reject);
    });
  };

  return (
    <div id="albums">
      <h1>Albums</h1>
      <LazyList fetch={fetch} children={AlbumLazyListItem} />
    </div>
  );
}