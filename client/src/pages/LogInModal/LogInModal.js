import React, { useState } from "react";
import { Modal, Button, Form } from "react-bootstrap";
import styles from "./LogInModal.module.css";
import { FaUser, FaLock } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import SignUpModal from "../SignUpModal/SignUpModal";
import axios from "axios";
import { useAuth } from "../../context/AuthContext";
import toast, { Toaster } from "react-hot-toast"; // Import toast

const LogInModal = ({ show, handleClose }) => {
  const navigate = useNavigate();
  const { handleLogin } = useAuth(); // Access the handleLogin function from context
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [showSignUp, setShowSignUp] = useState(false);

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      setError("Both fields are required.");
      return;
    }

    try {
      const formData = { email, password };
      const response = await axios.post("http://localhost:5000/api/users/login", formData);
      const { success, msg, token, user } = response.data;

      if (success) {
        // Show success toast
        toast.success(msg);

        // Store login state and user details in localStorage using handleLogin
        handleLogin(token, user);

        // Navigate to profile page
        navigate("/profile");
      } else {
        setError(msg);
        toast.error(msg);
      }
    } catch (err) {
      console.error("Login error:", err);
      setError("An error occurred during login. Please try again.");
      toast.error("An error occurred during login. Please try again.");
    }

    setEmail("");
    setPassword("");
    handleClose();
  };

  const handleSignUp = () => {
    setShowSignUp(true);
    handleClose();
  };

  return (
    <>
      <Toaster />
      <Modal show={show} onHide={handleClose} centered>
        <Modal.Header closeButton>
          <Modal.Title className={styles.modalTitle}>Login</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleLoginSubmit} className={styles.form}>
            {error && <div className={styles.errorMessage}>{error}</div>}
            <Form.Group className="mb-3" controlId="formBasicEmail">
              <Form.Label className={styles.formLabel}>
                <FaUser className={styles.icon} /> Email address
              </Form.Label>
              <Form.Control
                type="email"
                placeholder="Enter email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={`${styles.formControl}`}
                required
              />
            </Form.Group>

            <Form.Group className="mb-3" controlId="formBasicPassword">
              <Form.Label className={styles.formLabel}>
                <FaLock className={styles.icon} /> Password
              </Form.Label>
              <Form.Control
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className={`${styles.formControl}`}
                required
              />
            </Form.Group>

            <Button variant="primary" type="submit" className={`w-100 ${styles.submitButton}`}>
              Log In
            </Button>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <div className={styles.footer}>
            <span>Don't have an account?</span>
            <Link onClick={handleSignUp} className={styles.registerLink}>
              Sign Up
            </Link>
          </div>
        </Modal.Footer>
      </Modal>

      {showSignUp && <SignUpModal show={showSignUp} handleClose={() => setShowSignUp(false)} />}
    </>
  );
};

export default LogInModal;
