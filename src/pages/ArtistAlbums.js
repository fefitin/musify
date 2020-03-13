import React, { useEffect, useState } from 'react';
import LazyList from '../components/LazyList';
import ArtistModel from '../models/ArtistModel';
import AlbumModel from '../models/AlbumModel';
import AlbumLazyListItem from '../components/AlbumLazyListItem';
import { useParams } from "react-router-dom";

export default function ArtistAlbums(props) {
  const { artistId } = useParams();
  const [title, setTitle] = useState([]);
  
  useEffect(() => {
    ArtistModel.get(artistId).then(artist => setTitle(artist.name));
  }, [artistId]);

  const fetch = function(skip, size) {
    return new Promise((resolve, reject) => {
      AlbumModel.listForArtist(artistId, skip, size).then(data => resolve(data.albums)).catch(reject);
    });
  }
  
  return (
    <div id="albums">
      <h1>{title}</h1>
      <LazyList fetch={fetch} children={AlbumLazyListItem} />
    </div>
  );
}