import React, { useState } from "react";
import { Modal, Button, Form } from "react-bootstrap";
import styles from "./SignUpModal.module.css"; // Importing external CSS module
import { FaUser, FaLock } from "react-icons/fa";
import { FaPhone } from "react-icons/fa6";
import { TfiEmail } from "react-icons/tfi";
import { MdSell, MdOutlineShoppingCart } from "react-icons/md"; // Icons for user types
import LogInModal from "../LogInModal/LogInModal";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast"; // Importing React Hot Toast
import { useAuth } from "../../context/AuthContext"; // Importing AuthContext

const SignUpModal = ({ show, handleClose }) => {
  const { handleLogin } = useAuth(); // Access the handleLogin function from context
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhoneNumber] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("Buyer");
  const [error, setError] = useState("");
  const [showLogIn, setShowLogIn] = useState(false);

  const handleSignUp = async (e) => {
    e.preventDefault();
    if (!name || !email || !phone || !password || !role) {
      setError("All fields are required.");
      toast.error("All fields are required.");
      return;
    }

    const formData = { name, email, phone, password, role };
    toast.dismiss(); // Dismiss any existing toasts to avoid duplicates

    try {
      const res = await axios.post(
        "https://pet-market-place-server.onrender.com/api/users/create",
        formData
      );
      console.log(res.data);
      toast.success("Sign-up successful! Logging you in...");

      // Call login API immediately after successful sign-up
      const loginFormData = { email, password };
      const loginRes = await axios.post(
        "https://pet-market-place-server.onrender.com/api/users/login",
        loginFormData
      );
      const { success, msg, token, user } = loginRes.data;

      if (success) {
        // Show success toast
        toast.success(msg);

        // Store login state and user details in localStorage using handleLogin
        handleLogin(token, user);

        // Close sign-up modal and open login modal if needed
        handleClose(); // Close sign-up modal after successful login
      } else {
        setError(msg);
        toast.error(msg);
      }
    } catch (err) {
      console.error(err);
      toast.error("An error occurred. Please try again.");
    }
  };

  const handleShowLogIn = () => {
    setShowLogIn(true); // Open Log In modal
    handleClose(); // Close Sign Up modal
  };

  return (
    <>
      {/* Toaster component to display notifications */}
      <Toaster />

      <Modal show={show} onHide={handleClose} centered>
        <Modal.Header closeButton>
          <Modal.Title className={styles.modalTitle}>Sign Up</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleSignUp} className={styles.form}>
            {error && <div className={styles.errorMessage}>{error}</div>}

            {/* Username Field */}
            <Form.Group className="mb-3" controlId="formBasicUsername">
              <Form.Label className={styles.formLabel}>
                <FaUser className={styles.icon} /> Username
              </Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter username"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className={styles.formControl}
              />
            </Form.Group>

            {/* Email Field */}
            <Form.Group className="mb-3" controlId="formBasicEmail">
              <Form.Label className={styles.formLabel}>
                <TfiEmail className={styles.icon} /> Email address
              </Form.Label>
              <Form.Control
                type="email"
                placeholder="Enter email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={styles.formControl}
              />
            </Form.Group>

            {/* Phone Number Field */}
            <Form.Group className="mb-3" controlId="formBasicPhoneNumber">
              <Form.Label className={styles.formLabel}>
                <FaPhone className={styles.icon} /> Phone Number
              </Form.Label>
              <Form.Control
                type="tel"
                placeholder="Enter phone number"
                value={phone}
                onChange={(e) => setPhoneNumber(e.target.value)}
                className={styles.formControl}
              />
            </Form.Group>

            {/* Password Field */}
            <Form.Group className="mb-3" controlId="formBasicPassword">
              <Form.Label className={styles.formLabel}>
                <FaLock className={styles.icon} /> Password
              </Form.Label>
              <Form.Control
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className={styles.formControl}
              />
            </Form.Group>

            {/* User Type Selection */}
            <Form.Group className="mb-3" controlId="formBasicUserType">
              <Form.Label className={styles.formLabel}>User Type</Form.Label>
              <div className={styles.userTypeGroup}>
                <Form.Check
                  inline
                  type="radio"
                  label={
                    <>
                      <MdOutlineShoppingCart className={styles.icon} /> Buyer
                    </>
                  }
                  name="role"
                  value="Buyer"
                  checked={role === "Buyer"}
                  onChange={() => setRole("Buyer")}
                  className={styles.radioOption}
                />
                <Form.Check
                  inline
                  type="radio"
                  label={
                    <>
                      <MdSell className={styles.icon} /> Seller
                    </>
                  }
                  name="role"
                  value="Seller"
                  checked={role === "Seller"}
                  onChange={() => setRole("Seller")}
                  className={styles.radioOption}
                />
              </div>
            </Form.Group>

            <Button
              variant="primary"
              type="submit"
              className={`w-100 ${styles.submitButton}`}
            >
              Sign Up
            </Button>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <div className={styles.footer}>
            <span>Already have an account?</span>
            <Button
              variant="link"
              className={styles.registerLink}
              onClick={handleShowLogIn}
            >
              Log in
            </Button>
          </div>
        </Modal.Footer>
      </Modal>

      {/* Conditionally render LogInModal */}
      {showLogIn && (
        <LogInModal
          show={showLogIn}
          handleClose={() => setShowLogIn(false)}
        />
      )}
    </>
  );
};

export default SignUpModal;
