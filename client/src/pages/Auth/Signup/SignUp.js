import React, { useState } from 'react';
import styles from './SignUp.module.css';
import { FaCamera } from 'react-icons/fa';

const SignUp = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [profilePic, setProfilePic] = useState(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle form submission logic here
    console.log('Signed up:', { name, email, password, profilePic });
  };

  return (
    <div className={`${styles.container} container my-5`}>
      <div className={`${styles.card} card`}>
        <div className={`${styles.cardHeader} card-header`}>
          <h4 className={styles.title}>Sign Up</h4>
        </div>
        <div className={`${styles.cardBody} card-body`}>
          <form onSubmit={handleSubmit}>
            <div className={`${styles.formGroup} form-group`}>
              <label htmlFor="name" className={styles.label}>
                Name
              </label>
              <input
                type="text"
                id="name"
                className={`${styles.formControl} form-control`}
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>
            <div className={`${styles.formGroup} form-group`}>
              <label htmlFor="email" className={styles.label}>
                Email
              </label>
              <input
                type="email"
                id="email"
                className={`${styles.formControl} form-control`}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className={`${styles.formGroup} form-group`}>
              <label htmlFor="password" className={styles.label}>
                Password
              </label>
              <input
                type="password"
                id="password"
                className={`${styles.formControl} form-control`}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <div className={`${styles.formGroup} form-group`}>
              <label htmlFor="profilePic" className={styles.label}>
                Profile Picture
              </label>
              <div className={styles.profilePicContainer}>
                {profilePic ? (
                  <img
                    src={URL.createObjectURL(profilePic)}
                    alt="Profile"
                    className={styles.profilePic}
                  />
                ) : (
                  <div className={styles.profilePicPlaceholder}>
                    <FaCamera size={48} color="#ccc" />
                  </div>
                )}
                <input
                  type="file"
                  id="profilePic"
                  accept="image/*"
                  className={styles.fileInput}
                  onChange={(e) => setProfilePic(e.target.files[0])}
                />
              </div>
            </div>
            <button type="submit" className={`${styles.submitBtn} btn btn-primary`}>
              Sign Up
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default SignUp;