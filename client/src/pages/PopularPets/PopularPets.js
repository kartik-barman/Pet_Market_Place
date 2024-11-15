import React, { useState, useEffect } from "react";
import {
  FaPaw,
  FaHeart,
  FaArrowLeft,
  FaArrowRight,
  FaStar,
  FaPause,
  FaPlay,
} from "react-icons/fa";
import styles from "./PopularPets.module.css";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";
import { Link } from "react-router-dom";

const PopularPets = () => {
  const token = localStorage.getItem("token");
  const [activeSlide, setActiveSlide] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [pets, setPets] = useState([]);

  // Fetch pets data from the API
  const fetchPet = async () => {
    try {
      const res = await axios.get(
        "https://pet-market-place-api-server.vercel.app/api/pets/"
      );
      const result = res.data;
      setPets(result.pets);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchPet();
  }, []);

  const handleAddToCart = async (petId) => {
    if (!token) {
      toast.error("Please log in to add items to your cart.");
      return;
    }
    try {
      const res = await axios.put(
        `https://pet-market-place-api-server.vercel.app/api/users/cart/${petId}`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      const { success, msg } = res.data;
      success ? toast.success(msg) : toast.error("Failed to add to cart.");
    } catch (error) {
      console.error("Error adding to cart:", error);
      toast.error("An error occurred while adding to cart.");
    }
  };

  useEffect(() => {
    let interval;
    if (!isPaused && pets.length > 0) {
      interval = setInterval(() => {
        setActiveSlide((prev) => (prev + 1) % (pets.length - 3)); // Slide one item at a time
      }, 3000); // Slide every 2 seconds
    }
    return () => clearInterval(interval);
  }, [isPaused, pets.length]);

  const handleNext = () => {
    setActiveSlide((prev) => (prev + 1) % (pets.length - 3)); // Next pet (but only slides one item at a time)
  };

  const handlePrev = () => {
    setActiveSlide((prev) => (prev - 1 + pets.length - 3) % (pets.length - 3)); // Previous pet
  };

  const togglePause = () => {
    setIsPaused(!isPaused);
  };

  return (
    <section className={`${styles.popularPets} py-5`}>
      <div className="container">
        {/* Header */}
        <Toaster />
        <div className="row mb-4">
          <div className="col-12">
            <div className={styles.sectionHeader}>
              <h2 className="text-center mb-3">
                <FaPaw className={styles.headerIcon} />
                Popular Pets
              </h2>
              <p className="text-center text-muted">
                Find your perfect companion from our most loved pets
              </p>
              <button
                className={styles.pauseButton}
                onClick={togglePause}
                aria-label={isPaused ? "Resume autoplay" : "Pause autoplay"}
              >
                {isPaused ? <FaPlay /> : <FaPause />}
              </button>
            </div>
          </div>
        </div>

        {/* Carousel */}
        <div className="position-relative">
          <div className={`row ${styles.petsRow}`}>
            {pets.slice(activeSlide, activeSlide + 4).map((pet) => (
              <div
                key={pet._id}
                className={`col-lg-3 col-md-6 mb-4 ${styles.petCard}`}
              >
                <div className={`card ${styles.card}`}>
                  <div className={styles.imageContainer}>
                    <Link to={`/pet/${pet._id}`}>
                      <img
                        src={pet.images[0]}
                        alt={`${pet.breed} named ${pet.name}`}
                        className="card-img-top"
                      />
                    </Link>
                    <button className={styles.favoriteBtn}>
                      <FaHeart />
                    </button>
                    <div className={styles.age}>{pet.age}</div>
                  </div>
                  <div className="card-body">
                    <div className={styles.petInfo}>
                      <h5 className="card-title mb-1">{pet.name}</h5>
                      <p className="text-muted mb-2">{pet.breed}</p>
                    </div>
                    <div className={styles.rating}>
                      <FaStar className={styles.starIcon} />
                      <span>{pet.rating}</span>
                      <small className="text-muted">
                        ({pet.reviews} reviews)
                      </small>
                    </div>
                    <div className={styles.priceRow}>
                      <span className={styles.price}>₹{pet.price}</span>
                      <button
                        className={styles.adoptButton}
                        onClick={() => handleAddToCart(pet._id)}
                      >
                        Adopt Now
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Navigation Buttons */}
          <button
            className={`${styles.navButton} ${styles.prevButton}`}
            onClick={handlePrev}
          >
            <FaArrowLeft />
          </button>
          <button
            className={`${styles.navButton} ${styles.nextButton}`}
            onClick={handleNext}
          >
            <FaArrowRight />
          </button>
        </div>

        {/* Carousel Indicators */}
        <div className={styles.indicators}>
          {pets.map((_, idx) => (
            <button
              key={idx}
              className={`${styles.indicator} ${
                activeSlide === idx ? styles.activeIndicator : ""
              }`}
              onClick={() => setActiveSlide(idx)}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default PopularPets;
