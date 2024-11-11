import React, { useEffect, useState } from "react";
import {
  FaEnvelope,
  FaPhone,
  FaMapMarkerAlt,
  FaCalendarAlt,
  FaHeart,
  FaComment,
  FaStar,
  FaPaw,
} from "react-icons/fa";
import styles from "./GlobalProfile.module.css";
import axios from "axios";
import { useParams } from "react-router-dom";

const GlobalProfile = () => {
    const {userId} = useParams();
    const [user, setUser] = useState(null)
    const fetchUser = async () => {
        try {
          const res = await axios.get(`http://localhost:5000/api/users/user/${userId}`);
          const { user } = res.data;
          setUser(user);
        } catch (error) {
          console.error(error);
        }
      };
    
      useEffect(() => {
        fetchUser();
      }, []);
      console.log(user?.pets || null);
//   const user = {
//     name: "John Doe",
//     email: "john.doe@example.com",
//     phone: "123-456-7890",
//     location: "New York, USA",
//     joinDate: "January 2022",
//     about: "Lover of pets, passionate about animal welfare.",
//     stats: {
//       pets: 3,
//       reviews: 15,
//       favorites: 24,
//       messages: 8,
//     },
//     badges: ["Verified Owner", "Top Reviewer", "Community Leader"],
//     pets: [
//       { name: "Max", type: "Dog", breed: "Golden Retriever", age: 3 },
//       { name: "Luna", type: "Dog", breed: "Husky", age: 2 },
//       { name: "Milo", type: "Cat", breed: "Persian", age: 4 },
//     ],
//     avatar: "https://via.placeholder.com/150", // Placeholder avatar
//     banner: "https://via.placeholder.com/600x200", // Placeholder banner
//     createdAt: "2022-01-01T00:00:00Z", // Example date
//   };

  const createdAt = user?.createdAt;
  const date = new Date(createdAt);
  const formattedDate = date.toLocaleString("en-US", { month: "long", year: "numeric" });

  return (
    <div className="container py-5">
      <div className={`card ${styles.profileCard}`}>
        {/* Banner */}
        <div className={styles.profileBanner}>
          <img src={user?.banner} alt="Profile Banner" className={`${styles.bannerImg} w-100`} />
        </div>

        <div className="card-body">
          <div className={styles.profileHeader}>
            {/* Profile Photo */}
            <div className={styles.profilePhoto}>
              <img
                src={user?.avatar}
                alt="Profile"
                style={{ width: "120px", height: "120px", borderRadius: "100%" }}
              />
            </div>
            <div className={styles.profileInfo}>
              <h1 className="h3 mb-2 mt-5">{user?.name}</h1>
              <p className="text-muted mb-3">
                <FaMapMarkerAlt className="me-2" />
                {user?.location}
              </p>
            </div>
          </div>

          {/* Contact Information */}
          <div className="row mt-4">
            <div className="col-md-6 mb-3">
              <div className={styles.contactItem}>
                <FaEnvelope className={styles.contactIcon} />
                <span>{user?.email}</span>
              </div>
            </div>
            <div className="col-md-6 mb-3">
              <div className={styles.contactItem}>
                <FaPhone className={styles.contactIcon} />
                <span>{user?.phone}</span>
              </div>
            </div>
            <div className="col-md-6 mb-3">
              <div className={styles.contactItem}>
                <FaCalendarAlt className={styles.contactIcon} />
                <span>Joined {formattedDate}</span>
              </div>
            </div>
          </div>

          {/* Stats */}
          <div className="row mt-4">
            <div className="col-6 col-md-3 mb-3">
              <div className={styles.statCard}>
                <FaPaw className={styles.statIcon} />
                <div className={styles.statValue}>{user?.pets.length}</div>
                <div className={styles.statLabel}>Pets</div>
              </div>
            </div>
            <div className="col-6 col-md-3 mb-3">
              <div className={styles.statCard}>
                <FaStar className={styles.statIcon} />
                <div className={styles.statValue}>0</div>
                <div className={styles.statLabel}>Reviews</div>
              </div>
            </div>
            <div className="col-6 col-md-3 mb-3">
              <div className={styles.statCard}>
                <FaHeart className={styles.statIcon} />
                <div className={styles.statValue}>0</div>
                <div className={styles.statLabel}>Favorites</div>
              </div>
            </div>
            <div className="col-6 col-md-3 mb-3">
              <div className={styles.statCard}>
                <FaComment className={styles.statIcon} />
                <div className={styles.statValue}>0</div>
                <div className={styles.statLabel}>Messages</div>
              </div>
            </div>
          </div>

          {/* About Section */}
          <div className="mt-4">
            <h5>About</h5>
            <p>{user?.about}</p>
          </div>

          {/* Badges */}
          {/* <div className="mt-4">
            <h5>Badges</h5>
            <div className="d-flex flex-wrap">
              {user.badges.map((badge, index) => (
                <div key={index} className="badge bg-primary me-2 mb-2">
                  {badge}
                </div>
              ))}
            </div>
          </div> */}

          {/* Pets */}
          <div className="mt-4">
            <h5>My Pets</h5>
            <div className="d-flex flex-wrap">
              {user?.pets.map((pet, index) => (
                <div key={index} className="card me-2 mb-3" style={{ width: "18rem" }}>
                  <img src={pet?.images[0]} className="card-img-top" alt={pet.name} style={{maxHeight : "150px"}}/>
                  <div className="card-body">
                    <h6 className="card-title">{pet.name}</h6>
                    <p className="card-text">
                      {pet.type} ({pet.breed}) - {pet.age} old
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GlobalProfile;
