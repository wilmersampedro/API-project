// frontend/src/components/Navigation/ProfileButton.jsx

import { useEffect, useState, useRef } from 'react';
import { useDispatch } from 'react-redux';
import * as sessionActions from '../../store/session';
import OpenModalMenuItem from './OpenModalMenuItem';
import LoginFormModal from '../LoginFormModal/LoginFormModal';
import SignupFormModal from '../SignupFormModal/SignupFormModal';
import { useNavigate } from 'react-router-dom';


function ProfileButton({ user }) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [showMenu, setShowMenu] = useState(false);
  const ulRef = useRef();

  const toggleMenu = (e) => {
    e.stopPropagation(); // Keep from bubbling up to document and triggering closeMenu
    setShowMenu(!showMenu);
  };

  useEffect(() => {
    if (!showMenu) return;

    const closeMenu = (e) => {
      if (!ulRef.current.contains(e.target)) {
        setShowMenu(false);
      }
    };

    document.addEventListener('click', closeMenu);

    return () => document.removeEventListener("click", closeMenu);
  }, [showMenu]);

  const closeMenu = () => setShowMenu(false);

  const logout = (e) => {
    e.preventDefault();
    dispatch(sessionActions.logout());
    closeMenu();
    navigate('/')
  };

  const ulClassName = "profile-dropdown" + (showMenu ? "" : " hidden");

  return (
    <>
      <button id='profileButtonNav' onClick={toggleMenu}>
        <i className="fa-solid fa-user"></i>
      </button>
      <ul className={ulClassName} ref={ulRef}>
        {user ? (
          <div id='profileButtonDropDownLoggedIn'>
            <div id='profileButtonDropDownEmail'>
            <li className='profileDropMenuItemsLoggedIn'>Hello, {user.firstName}</li>
            <li className='profileDropMenuItemsLoggedIn'>{user.email}</li>
            </div>
            {/* <li>{user.username}</li> */}
            <li id='manageSpotContainerDropDown'>
              <a id='manageSpotsLink' href='/spots/current'>Manage Spots</a>
            </li>
            <li id='logoutButtonDropDownMenuLi'>
              <button id='logoutButtonDropDownMenu' onClick={logout}>Log Out</button>
            </li>
          </div>
        ) : (
          <div id='profileButtonDropDownLoggedOut'>
            <OpenModalMenuItem
              itemText="Log In"
              onItemClick={closeMenu}
              modalComponent={<LoginFormModal />}
            />
            <OpenModalMenuItem
              itemText="Sign Up"
              onItemClick={closeMenu}
              modalComponent={<SignupFormModal />}
            />
          </div>
        )}
      </ul>
    </>
  );
}

export default ProfileButton;
