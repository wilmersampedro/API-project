// frontend/src/components/SignupFormPage/SignupFormPage.jsx

import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useModal } from '../../context/Modal';
import * as sessionActions from '../../store/session';
import './SignupForm.css';

function SignupFormModal() {
  const dispatch = useDispatch();
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errors, setErrors] = useState({});
  const { closeModal } = useModal();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (password === confirmPassword) {
      setErrors({});
      return dispatch(
        sessionActions.signup({
          email,
          username,
          firstName,
          lastName,
          password
        })
      )
        .then(closeModal)
        .catch(async (res) => {
          const data = await res.json();
          if (data?.errors) {
            setErrors(data.errors);
          }
        });
    }
    return setErrors({
      confirmPassword: "Confirm Password field must be the same as the Password field"
    });
  };

  return (
    <div id='signUpModalContainer'>
      <h1>Sign Up</h1>
      {/* <div id='outerSignUpFormContainer'> */}

      <form id='signUpModalFormContainer' onSubmit={handleSubmit}>
        <div className='signUpFormSectionContainer'>
        <label>
          First Name
          <input
            className='signUpFormInputFields'
            type="text"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            required
          />
        </label>
        {errors.firstName && <p  className='signupFormErrors' style={{color:"red"}}>{errors.firstName}</p>}
        <label>
          Last Name
          <input
            className='signUpFormInputFields'
            type="text"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            required
          />
        </label>
        {errors.lastName && <p className='signupFormErrors'  style={{color:"red"}}>{errors.lastName}</p>}

        </div>
        <div className='signUpFormSectionContainer'>
          <label>
            Email
            <input
              className='signUpFormInputFields'
              type="text"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </label>
          {errors.email && <p  className='signupFormErrors' style={{color:"red"}}>{errors.email}</p>}
          <label>
            Username
            <input
              className='signUpFormInputFields'
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </label>
          {errors.username && <p  className='signupFormErrors' style={{color:"red"}}>{errors.username}</p>}
        </div>
        <div className='signUpFormSectionContainer'>
        <label>
          Password
          <input
            className='signUpFormInputFields'
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </label>
        {errors.password && <p className='signupFormErrors' style={{color:"red"}}>{errors.password}</p>}
        <label>
          Confirm Password
          <input
            className='signUpFormInputFields'
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
        </label>
        {errors.confirmPassword && (
          <p className='signupFormErrors' style={{color:"red"}}>{errors.confirmPassword}</p>
        )}


        </div>
        <button id={(!email || !password || !confirmPassword || !firstName || !lastName || username.length < 4 || password.length < 6) ? 'disabledsignupFormButton' : 'signUpFormButtonConfirmation'} disabled={!email || !password || !confirmPassword || !firstName || !lastName || username.length < 4 || password.length < 6} type="submit">Sign Up</button>
      </form>
    </div>
    // </div>
  );
}

export default SignupFormModal;
