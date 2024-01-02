// frontend/src/components/Navigation/Navigation.jsx

import { NavLink } from 'react-router-dom';
import { useSelector } from 'react-redux';
import ProfileButton from './ProfileButton';
import './Navigation.css';
// import * as sessionActions from '../../store/session';

function Navigation({ isLoaded }) {
  const sessionUser = useSelector(state => state.session.user);

  return (
    <ul id='navbar'>
      <li>
        <NavLink to="/"><i className="fa-solid fa-won-sign logo" style={{ color: "red" }}></i></NavLink>
      </li>
      {isLoaded && (
        <div id='right-side-nav'>
        {sessionUser ? <li id='create-a-spot-li'>
          <a id='createSpotLink' href='/spots/new'>Create a New Spot</a>
        </li> : null}
        <li id='profileButton'>
          <ProfileButton user={sessionUser} />
        </li>
        </div>
      )}
    </ul>
  );
}

export default Navigation;
