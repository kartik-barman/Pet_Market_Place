import React, { useEffect, useState } from "react";
import {
  FaShoppingCart,
  FaPlus,
  FaMinus,
  FaTrashAlt,
  FaCreditCard,
  FaArrowRight,
  FaLock,
  FaPaypal,
} from "react-icons/fa";
import {
  BsCreditCard2Front,
  BsCreditCard2Back,
  BsExclamationCircle,
} from "react-icons/bs";
import styles from "./Cart.module.css";
import { Link } from "react-router-dom";
import axios from "axios";
import toast,{ Toaster } from "react-hot-toast";
import { useAuth } from "../../context/AuthContext";

const Cart = () => {
  const isLoggedIn = localStorage.getItem("isLoggedIn");
  const [cartItems, setCartItems] = useState([]);
  const token = localStorage.getItem("token");
const fetchCartItems = async () => {
    if (!token) return; // Prevent fetching if not authenticated
    try {
      const res = await axios.get("http://localhost:5000/api/users/cart/", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setCartItems(res.data.cart);
    } catch (error) {
      console.error("Cart items fetch error:", error);
    }
  };

  useEffect(() => {
    if (isLoggedIn) {
      fetchCartItems();
    }
  }, [isLoggedIn]);
  const updateQuantity = async (id, newQuantity) => {
    try {
      const res = await axios.put(
        `http://localhost:5000/api/users/cart/item/${id}`,
        { newQuantity },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log(res.data.cart);
      fetchCartItems()
    } catch (error) {
      console.error("Cart items fetch error :", error);
      toast.error("Failed to update item quantity.");
    }
  };

  // Remove Cart Item Function

  const removeFromCart = async (id) => {
    try {
      const res = await axios.delete(
        `http://localhost:5000/api/users/cart/item/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const { success, msg } = res.data;
      if (success) {
        toast.success(msg);
        setCartItems((prevItems) =>
          prevItems.filter((item) => item._id !== id)
        );
      }
    } catch (error) {
      console.error("Error removing item:", error);
      toast.error("Failed to remove item from cart.");
    }
  };

 // Calculation Part 

  const subtotal = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );
  console.log(subtotal);
  const tax = subtotal * 0.08;
  const shipping = 25;
  const total = subtotal + tax + shipping;

  return (
    <div className="container py-4">
      <Toaster />
      <h1 className="mb-4 text-center">
        <FaShoppingCart className={`${styles.icon} me-2`} />
        Shopping Cart
      </h1>

      {cartItems.length === 0  ? (
        <div className={styles.emptyCart}>
          <FaShoppingCart size={48} className="text-muted mb-3" />
          <h3 className="text-muted">Your cart is empty</h3>
          <p className="text-muted">
            Add some pets to your cart to get started!
          </p>
          <Link to={`/`} className="btn btn-primary">
            Continue Shopping
          </Link>
        </div>
      ) : (
        <div className="row g-4">
          {/* Cart Items - Left Side */}
          <div className="col-12 col-lg-8">
            <div className="card">
              <div className="card-header bg-white">
                <h5 className="mb-0">
                  <FaShoppingCart className={`${styles.icon} me-2`} />
                  Cart Items ({cartItems.length})
                </h5>
              </div>
              <div className="card-body">
                {cartItems.map((item) => (
                  <div
                    key={item._id}
                    className={`${styles.cartItem} mb-3 p-3 rounded`}
                  >
                    <div className="d-flex gap-3">
                      <img
                        src={item.item.images[0]}
                        alt={item.name}
                        className={`rounded ${styles.cartImage}`}
                      />
                      <div className="flex-grow-1">
                        <div className="d-flex justify-content-between align-items-start">
                          <div>
                            <h3 className="h6 mb-1">{item.item.name}</h3>
                            <p className={`mb-0 ${styles.price}`}>
                              ₹{item.price}
                            </p>
                          </div>
                          <button
                            onClick={() => removeFromCart(item._id)}
                            className={`btn btn-link p-0 ${styles.deleteButton}`}
                          >
                            <FaTrashAlt size={16} />
                          </button>
                        </div>
                        <div className="mt-3 d-flex align-items-center gap-2">
                          <button
                            onClick={() => 
                              item.quantity > 1 ? updateQuantity(item._id, item.quantity - 1) : null
                            }
                            className={styles.quantityButton}
                            disabled={item.quantity === 1}
                          >
                            <FaMinus size={12} />
                          </button>
                          <span className="mx-2">{item.quantity}</span>
                          <button
                            onClick={() =>
                              updateQuantity(item._id, item.quantity + 1)
                            }
                            className={styles.quantityButton}
                          >
                            <FaPlus size={12} />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Checkout Section - Right Side */}
          <div className="col-12 col-lg-4">
            <div className={`card ${styles.checkoutSection}`}>
              <div className="card-header bg-white">
                <h5 className="mb-0">
                  <FaCreditCard className={`${styles.icon} me-2`} />
                  Order Summary
                </h5>
              </div>
              <div className="card-body">
                <div className={styles.summaryItem}>
                  <span>Subtotal</span>
                  <span>₹{subtotal.toFixed(2)}</span>
                </div>
                <div className={styles.summaryItem}>
                  <span>Tax (8%)</span>
                  <span>₹{tax.toFixed(2)}</span>
                </div>
                <div className={styles.summaryItem}>
                  <span>Shipping</span>
                  <span>₹{shipping.toFixed(2)}</span>
                </div>
                <div className={styles.summaryItem}>
                  <span className="fw-bold">Total</span>
                  <span className="fw-bold">₹{total.toFixed(2)}</span>
                </div>

                <Link to="/ckeckout">
                  <button
                    className={`btn btn-success w-100 mt-3 ${styles.checkoutButton}`}
                  >
                    <div className="d-flex align-items-center justify-content-center gap-2">
                      <FaLock size={16} />
                      Proceed to Checkout
                      <FaArrowRight size={16} />
                    </div>
                  </button>
                </Link>

                <div className="mt-4">
                  <div className="d-flex align-items-center justify-content-center gap-3 mb-3">
                    <BsCreditCard2Front size={32} className="text-primary" />
                    <BsCreditCard2Back size={32} className="text-success" />
                    <FaPaypal size={32} className="text-info" />
                  </div>
                  <div className="text-center text-muted small">
                    <FaLock className={`${styles.icon} me-1`} />
                    Secure checkout powered by PayPal
                  </div>
                </div>

                <div className="mt-3 p-2 bg-light rounded">
                  <div className="d-flex align-items-center text-muted small">
                    <BsExclamationCircle className={`${styles.icon} me-2`} />
                    Free shipping for orders over ₹1000
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Cart;
