import React from 'react';
import styles from './Hero.module.css';
import { Link } from 'react-router-dom';

const Hero = () => {
  return (
    <section className={`d-flex align-items-center ${styles.hero}`}>
      <div className="container text-center text-md-start">
        <div className={`row justify-content-center ${styles.heroContent}`}>
          <div className="col-md-8">
            <h1 className={styles.heroTitle}>Discover Your Perfect Pet</h1>
            <p className={styles.heroSubtitle}>
              Find and adopt the best companions that bring joy, love, and loyalty into your life. Explore our extensive collection of pets available for adoption and find the perfect match.
            </p>
            <Link to="/" className={`btn ${styles.heroButton}`}>
              Explore Pets
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
