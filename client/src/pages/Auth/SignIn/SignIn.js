import React, { useState } from 'react';
import { FaUserAlt, FaLockOpen } from 'react-icons/fa';
import styles from './SignIn.module.css';

const SignIn = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    // Add your login logic here
    console.log('Logging in with:', { username, password });
  };

  return (
    <div className={`${styles.loginContainer} d-flex justify-content-center align-items-center`}>
      <div className={`${styles.loginCard} card p-4`}>
        <h2 className={styles.title}>Pet Marketplace</h2>
        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={`${styles.formGroup} input-group mb-3`}>
            <span className={`${styles.inputGroupText} input-group-text`}>
              <FaUserAlt />
            </span>
            <input
              type="text"
              className={`${styles.formControl} form-control`}
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>
          <div className={`${styles.formGroup} input-group mb-3`}>
            <span className={`${styles.inputGroupText} input-group-text`}>
              <FaLockOpen />
            </span>
            <input
              type="password"
              className={`${styles.formControl} form-control`}
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <button type="submit" className={`${styles.loginButton} btn btn-primary`}>
            Login
          </button>
        </form>
      </div>
    </div>
  );
};

export default SignIn;