import React from 'react';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  NavLink
} from 'react-router-dom';
import './css/App.scss';
import Artists from './pages/Artists';
import Albums from './pages/Albums';
import Songs from './pages/Songs';

export default function App() {
  return (
    <Router>
      <main id="main">
        <Switch>
          <Route path="/artists">
            <Artists />
          </Route>
          <Route path="/albums">
            <Albums />
          </Route>
          <Route path="/songs">
            <Songs />
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
              <NavLink to="/songs" activeClassName="active">Songs</NavLink>
            </li>
          </ul>
        </nav>
      </aside>
      <footer id="player">
        
      </footer>
    </Router>
  );
}