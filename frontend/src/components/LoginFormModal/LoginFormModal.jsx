// frontend/src/components/LoginFormPage/LoginFormPage.jsx

import { useState } from 'react';
import * as sessionActions from '../../store/session';
import { useDispatch } from 'react-redux';
import { useModal } from '../../context/Modal';
import './LoginFormModal.css';


function LoginFormModal() {
  const dispatch = useDispatch();
  const [credential, setCredential] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({});
  const { closeModal } = useModal();

  const handleSubmit = (e) => {
    e.preventDefault();
    setErrors({});
    return dispatch(sessionActions.login({ credential, password }))
      .then(closeModal)
      .catch(async (res) => {
        const data = await res.json();
        if (data && data.errors) {
          setErrors(data.errors);
        }
      });
  };

  return (
    <div id='loginModalMainContainer'>
      <h1 id='loginModalHeader'>Log In</h1>
      <form onSubmit={handleSubmit} id="logInModalFormContainer">
        <label className='loginModalLabel'>
          Username or Email
          <input
            className='loginModalInputField'
            type="text"
            value={credential}
            onChange={(e) => setCredential(e.target.value)}
            required
          />
        </label>
        <label className='loginModalLabel'>
          Password
          <input
            className='loginModalInputField'
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </label>
        {errors.credential && (
          <p style={{ color: "red" }}>{errors.credential}</p>
        )}
        <button className={(credential.length < 4 || password.length < 6) ? 'loginModalButton' : 'enabledLoginButton'} type="submit" disabled={credential.length < 4 || password.length < 6}>Log In</button>
        <button className='enabledLoginButton' onClick={() => {
          setCredential("Demo-lition");
          setPassword("password")
        }}>Log in as Demo User</button>
      </form>
    </div>
  );
}

export default LoginFormModal;
