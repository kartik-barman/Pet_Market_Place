import React, { useEffect, useState } from "react";
import {
  FaPaw,
  FaSearch,
  FaUserCircle,
  FaShoppingCart,
  FaBars,
  FaTimes,
  FaUser,
} from "react-icons/fa";
import { HiOutlineLogout } from "react-icons/hi";
import { Link, useNavigate } from "react-router-dom";
import styles from "./NavBar.module.css";
import LogInModal from "../../pages/LogInModal/LogInModal";
import { useAuth } from "../../context/AuthContext";
import axios from "axios";

const NavBar = () => {
  const { isLoggedIn, handleLogout } = useAuth();
  const userType = localStorage.getItem("role"); // Get role from localStorage
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [cartItems, setCartItems] = useState([]);

  const toggleMenu = () => setIsOpen(!isOpen);
  const handleShow = () => setShowModal(true);
  const handleClose = () => setShowModal(false);

  const fetchCartItems = async () => {
    if (!isLoggedIn) return; // Fetch only if logged in
    try {
      const res = await axios.get(
        "https://pet-market-place-server.onrender.com/api/users/cart/",
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );
      setCartItems(res.data.cart);
    } catch (error) {
      console.error("Cart items fetch error:", error);
    }
  };

  useEffect(() => {
    fetchCartItems();
  }, []); // Run only when isLoggedIn changes

  return (
    <>
      <nav className={`navbar navbar-expand-lg ${styles.navbar}`}>
        <div className="container">
          {/* Brand */}
          <Link
            to="/"
            className={styles.brand}
            onClick={() => setIsOpen(false)}
          >
            <FaPaw className={styles.brandIcon} />
            <span>PetPal</span>
          </Link>

          {/* Toggle Button */}
          <button
            className={`navbar-toggler ${styles.toggleButton}`}
            onClick={toggleMenu}
            aria-controls="navbarNav"
            aria-expanded={isOpen ? "true" : "false"}
          >
            {isOpen ? <FaTimes /> : <FaBars />}
          </button>

          {/* Navbar Content */}
          <div
            className={`collapse navbar-collapse ${isOpen ? "show" : ""}`}
            id="navbarNav"
          >
            <ul className="navbar-nav mx-auto">
              <li className="nav-item">
                <Link
                  className={`nav-link ${styles.navLink}`}
                  to="/"
                  onClick={() => setIsOpen(false)}
                >
                  Home
                </Link>
              </li>
              {isLoggedIn &&
                userType === "Seller" && ( // Show only if logged in as Seller
                  <li className="nav-item">
                    <Link
                      className={`nav-link ${styles.navLink}`}
                      to="/sell"
                      onClick={() => setIsOpen(false)}
                    >
                      Sell a Pet
                    </Link>
                  </li>
                )}
              <li className="nav-item">
                <Link
                  className={`nav-link ${styles.navLink}`}
                  to="/about"
                  onClick={() => setIsOpen(false)}
                >
                  About Us
                </Link>
              </li>
              <li className="nav-item">
                <Link
                  className={`nav-link ${styles.navLink}`}
                  to="/contact"
                  onClick={() => setIsOpen(false)}
                >
                  Contact
                </Link>
              </li>
            </ul>

            {/* Action Icons */}
            <div className="d-flex align-items-center ms-lg-4 mt-3 mt-lg-0">
              {isLoggedIn && (
                <Link to="/cart" className={styles.iconButton} onClick={()=> setIsOpen(false)}>
                  <FaShoppingCart className={styles.navIcon} />
                  <span className={`${styles.badge} bg-primary`}>
                    {cartItems?.length || 0}
                  </span>
                </Link>
              )}
              <button
                className={styles.iconButton}
                onClick={() => {
                  if (isLoggedIn) {
                    navigate("/profile");
                    setIsOpen(false);
                  } else {
                    handleShow();
                  }
                }}
              >
                {isLoggedIn ? (
                  <FaUserCircle className={styles.navIcon} />
                ) : (
                  <FaUser className={styles.navIcon} />
                )}
              </button>
              {isLoggedIn && (
                <HiOutlineLogout
                  size={24}
                  className="text-danger"
                  style={{ marginTop: "5px", cursor: "pointer" }}
                  onClick={handleLogout}
                />
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Login Modal */}
      <LogInModal show={showModal} handleClose={handleClose} />
    </>
  );
};

export default NavBar;
