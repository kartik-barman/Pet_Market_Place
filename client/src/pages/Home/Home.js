import React, { useEffect, useState } from "react";
import axios from "axios";
import Pagination from "../../components/Pagination/Pagination";
import { useAuth } from "../../context/AuthContext";
import { Link } from "react-router-dom";
import {
  FaHeart,
  FaMapMarkerAlt,
  FaBirthdayCake,
  FaEye,
  FaComments,
  FaStar,
  FaDog,
  FaCat,
  FaKiwiBird,
  FaOtter,
} from "react-icons/fa";
import styles from "./Home.module.css";
import Hero from "../Hero/Hero";
import PopularPets from "../PopularPets/PopularPets";

const Home = () => {
  const token = localStorage.getItem("token");
  const { isLoggedIn } = useAuth();
  const [activeFilter, setActiveFilter] = useState("all");
  const [trendingPets, setTrendingPets] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const limit = 4; // Define the number of pets per page

  // Fetch pets based on current page and limit
  const fetchPet = async () => {
    try {
      const res = await axios.get(
        "https://pet-market-place-server.onrender.com/api/pets"
      );

      const result = res.data;

      // Sort pets by createdAt in descending order to show the latest first
      const sortedPets = result.pets.sort(
        (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
      );

      // Apply pagination on the sorted list
      const skip = (currentPage - 1) * limit;
      const paginatedPets = sortedPets.slice(skip, skip + limit);

      setTrendingPets(paginatedPets);
      setTotalPages(Math.ceil(sortedPets.length / limit)); // Calculate total pages based on all pets
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchPet();
  }, [currentPage]);

  console.log(trendingPets);

  const countViews = async (petId) => {
    try {
      if (!token) {
        throw new Error("Authorization token is missing");
      }

      const res = await axios.put(
        `https://pet-market-place-server.onrender.com/api/pets/view/${petId}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log("View count response:", res.data);
    } catch (error) {
      console.error(
        "Error incrementing view count:",
        error.response?.data || error.message
      );
    }
  };

  const getIcon = (type) => {
    switch (type) {
      case "dog":
        return <FaDog />;
      case "cat":
        return <FaCat />;
      case "bird":
        return <FaKiwiBird />;
      default:
        return <FaOtter />;
    }
  };

  const filters = [
    { id: "all", label: "All Pets" },
    { id: "Dog", label: "Dogs" },
    { id: "Cat", label: "Cats" },
    { id: "Bird", label: "Birds" },
  ];

  const filteredPets =
    activeFilter === "all"
      ? trendingPets
      : trendingPets.filter((pet) => pet.category === activeFilter);

  return (
    <>
      <Hero />
      <section className={styles.trendingSection}>
        <div className="container">
          <h2 className={styles.sectionTitle}>Trending Pets</h2>

          {/* Filters */}
          <div className="text-center mb-4">
            {filters.map((filter, index) => (
              <button
                key={index}
                className={`${styles.filterButton} ${
                  activeFilter === filter._id ? styles.active : ""
                }`}
                onClick={() => setActiveFilter(filter.id)}
              >
                {filter.label}
              </button>
            ))}
          </div>

          {/* Pets Grid */}
          <div className="row g-4">
            {filteredPets.map((pet, index) => (
              <div key={index} className="col-12 col-md-6 col-lg-3">
                <div className={styles.card}>
                  <div className={styles.imageContainer}>
                    <Link to={`/pet/${pet._id}`}>
                      <img
                        src={pet.images[0]}
                        alt={pet.name}
                        className={styles.image}
                      />
                    </Link>
                    <span className={`${styles.badge} ${styles.trending}`}>
                      Trending
                    </span>
                    <button className={styles.wishlistButton}>
                      <FaHeart />
                    </button>
                  </div>

                  <div className={styles.cardBody}>
                    <h3 className={styles.petName}>{pet.name}</h3>
                    <p className={styles.petName} style={{ color: "#6b46c1" }}>
                      <Link
                        to={`/profile/${pet.seller._id}`}
                        className="text-decoration-none"
                      >
                        Seller : {pet.seller.name}
                      </Link>
                    </p>
                    <div className={styles.petInfo}>
                      <span className={styles.petIcon}>
                        {getIcon(pet.category)}
                      </span>
                      <span>{pet.breed}</span>
                    </div>

                    <div className={styles.petInfo}>
                      <FaMapMarkerAlt />
                      <span>{pet.location}</span>
                    </div>

                    <div className={styles.petInfo}>
                      <FaBirthdayCake />
                      <span>{pet.age}</span>
                    </div>

                    <div className={styles.price}>₹{pet.price}</div>

                    <div className={styles.stats}>
                      <div className={styles.stat}>
                        <FaEye />
                        <span>{pet.views?.length}</span>
                      </div>
                      <div className={styles.stat}>
                        <FaComments />
                        <span>{pet.comments.length}</span>
                      </div>
                      <div className={styles.stat}>
                        <FaStar />
                        <span>{pet.rating}</span>
                      </div>
                    </div>

                    <Link
                      to={`/pet/${pet._id}`}
                      className="text-decoration-none text-white"
                    >
                      <button
                        className={`${styles.actionButton} ${styles.viewButton} mt-3`}
                        onClick={() => {
                          if (isLoggedIn) {
                            countViews(pet._id);
                          }
                        }}
                      >
                        View Details
                      </button>
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Load More Button */}
          {/* <div className="text-center">
            <Link to="/popular-pets">
              <button className={styles.loadMore}>Load More Pets</button>
            </Link>
          </div> */}
        </div>
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={(page) => {
            setCurrentPage(page); // Page change without scrolling
          }}
        />
        <PopularPets />
      </section>
    </>
  );
};

export default Home;
