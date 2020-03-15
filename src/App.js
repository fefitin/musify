import React from 'react';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  NavLink
} from 'react-router-dom';
import './css/App.scss';
import ArtistAlbums from './pages/ArtistAlbums';
import Album from './pages/Album';
import Artists from './pages/Artists';
import Albums from './pages/Albums';
import Tracks from './pages/Tracks';
import ActivePlayer from './containers/ActivePlayer';

export default function App() {
  return (
    <Router>
      <main id="main">
        <Switch>
          <Route path="/artists/:artistId">
            <ArtistAlbums />
          </Route>
          <Route path="/artists">
            <Artists />
          </Route>
          <Route path="/albums/:albumId">
            <Album />
          </Route>
          <Route path="/albums">
            <Albums />
          </Route>
          <Route path="/tracks">
            <Tracks />
          </Route>
        </Switch>
      </main>
      <aside id="menu">
        <nav>
          <h2>Your library</h2>
          <ul>
            <li>
              <NavLink to="/artists" activeClassName="active">Artists</NavLink>
            </li>
            <li>
              <NavLink to="/albums" activeClassName="active">Albums</NavLink>
            </li>
            <li>
              <NavLink to="/tracks" activeClassName="active">Tracks</NavLink>
            </li>
          </ul>
        </nav>
      </aside>
      <footer id="player">
        <ActivePlayer />
      </footer>
    </Router>
  );
}