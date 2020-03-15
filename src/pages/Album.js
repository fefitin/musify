import React, { useEffect, useState } from 'react';
import { NavLink } from 'react-router-dom';
import LazyList from '../components/LazyList';
import AlbumModel from '../models/AlbumModel';
import AlbumTrackLazyListItemLink from '../containers/AlbumTrackLazyListItemLink';
import { useParams } from "react-router-dom";

export default function Album(props) {
  const { albumId } = useParams();
  const [album, setAlbum] = useState({});
  const [trackNo, setTrackNo] = useState(0);
  
  useEffect(() => {
    AlbumModel.get(albumId).then(album => {
      setAlbum(album);
      setTrackNo(album.tracks.length);
    });
  }, [albumId]);

  const fetch = function(skip, size) {
    return new Promise((resolve, reject) => {
      if(album && album.tracks && skip === 0) {
        resolve(album.tracks);
      }
    });
  }

  let artist;
  if(album.artist)
    artist = <h2><NavLink to={album.artist.url}>{album.artist.name}</NavLink></h2>;
  
  return (
    <div id="albums">
      <header>
        <div className="image">
          <img src={album.image} alt={album.name} />
        </div>
        <div className="info">
          <h1>{album.name}</h1>
          {artist}
          <p>{album.year} · {trackNo} track{trackNo !== 1 ? 's' : ''}</p>
        </div>
      </header>

      <div className="content">
        <LazyList fetch={fetch} children={AlbumTrackLazyListItemLink} className="tracks" />
      </div>
    </div>
  );
}