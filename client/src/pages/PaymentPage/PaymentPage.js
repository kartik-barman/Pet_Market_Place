import React, { useEffect, useState } from "react";
import {
  FaCreditCard,
  FaPaypal,
  FaGooglePay,
  FaApplePay,
  FaLock,
  FaRegCreditCard,
  FaCalendarAlt,
  FaShieldAlt,
  FaCheckCircle,
} from "react-icons/fa";
import { FaCcVisa } from "react-icons/fa";
import { FaCcMastercard } from "react-icons/fa";
import { BsBank, BsCreditCard2Front } from "react-icons/bs";
import { FaHandHoldingUsd } from "react-icons/fa";
import { GiPayMoney } from "react-icons/gi";
import styles from "./PaymentPage.module.css";
import axios from "axios";

const PaymentPage = () => {
  const [cartItems, setCartItems] = useState([]);
  const [selectedMethod, setSelectedMethod] = useState("credit-card");

  const paymentMethods = [
    {
      id: "credit-card",
      name: "Credit Card",
      icon: <FaCreditCard size={24} />,
    },
    { id: "paypal", name: "PayPal", icon: <FaPaypal size={24} /> },
    { id: "google-pay", name: "Google Pay", icon: <FaGooglePay size={24} /> },
    { id: "apple-pay", name: "Apple Pay", icon: <FaApplePay size={24} /> },
    { id: "bank", name: "Bank Transfer", icon: <BsBank size={24} /> },
    {
      id: "Cash on delivery",
      name: "Cash On Delivery",
      icon: <FaHandHoldingUsd size={24} />,
    },
  ];

  const token = localStorage.getItem("token");
  const fetchCartItems = async () => {
    try {
      const res = await axios.get(
        "https://pet-market-place-server.onrender.com/api/users/cart/",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log(res.data.cart);
      setCartItems(res.data.cart);
    } catch (error) {
      console.error("Cart items fetch error :", error);
    }
  };
  useEffect(() => {
    fetchCartItems();
  }, []);
  const subtotal = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );
  const tax = subtotal * 0.08;
  const shipping = 25;
  const total = subtotal + tax + shipping;
  return (
    <div className="container py-5">
      <div className="row justify-content-center">
        <div className="col-lg-8">
          <div className={`card ${styles.paymentCard}`}>
            <div className="card-body p-4">
              <h2 className="mb-4 d-flex align-items-center gap-2">
                <FaRegCreditCard /> Payment Details
              </h2>

              {/* Payment Methods */}
              <div className="mb-4">
                <h5 className="mb-3">Select Payment Method</h5>
                <div className="row g-3">
                  {paymentMethods.map((method) => (
                    <div key={method.id} className="col-6 col-md-4">
                      <div
                        className={`${
                          styles.methodCard
                        } card h-100 p-3 text-center 
                          ${
                            selectedMethod === method.id
                              ? styles.methodCardSelected
                              : ""
                          }`}
                        onClick={() => setSelectedMethod(method.id)}
                      >
                        <div className="d-flex flex-column align-items-center gap-2">
                          {method.icon}
                          <span>{method.name}</span>
                          {selectedMethod === method.id && (
                            <FaCheckCircle className="text-primary" size={16} />
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Credit Card Form */}
              {selectedMethod === "credit-card" && (
                <div className="mt-4">
                  <div className={styles.inputGroup}>
                    <label className="form-label">Card Number</label>
                    <div className="position-relative">
                      <input
                        type="text"
                        className={`form-control ${styles.cardInput}`}
                        placeholder="1234 5678 9012 3456"
                      />
                      <BsCreditCard2Front
                        className={styles.cardIcon}
                        size={20}
                      />
                    </div>
                  </div>

                  <div className="row">
                    <div className="col-md-6">
                      <div className={styles.inputGroup}>
                        <label className="form-label">Expiration Date</label>
                        <div className="position-relative">
                          <input
                            type="text"
                            className={`form-control ${styles.cardInput}`}
                            placeholder="MM/YY"
                          />
                          <FaCalendarAlt
                            className={styles.cardIcon}
                            size={20}
                          />
                        </div>
                      </div>
                    </div>
                    <div className="col-md-6">
                      <div className={styles.inputGroup}>
                        <label className="form-label">Security Code</label>
                        <div className="position-relative">
                          <input
                            type="text"
                            className={`form-control ${styles.cardInput} ${styles.securityCode}`}
                            placeholder="CVV"
                          />
                          <FaShieldAlt className={styles.cardIcon} size={20} />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Order Summary */}
              <div className={`${styles.orderSummary} mt-4`}>
                <h5 className="mb-3">Order Summary</h5>
                <div className={styles.summaryItem}>
                  <span>Subtotal</span>
                  <span>₹{subtotal.toFixed(2)}</span>
                </div>
                <div className={styles.summaryItem}>
                  <span>Tax</span>
                  <span>₹{tax.toFixed(2)}</span>
                </div>
                <div className={styles.summaryItem}>
                  <span>Shipping</span>
                  <span>₹{shipping.toFixed(2)}</span>
                </div>
                <div className={`${styles.summaryItem} fw-bold`}>
                  <span>Total</span>
                  <span>₹{total.toFixed(2)}</span>
                </div>
              </div>

              {/* Secure Payment Label */}
              <div className="d-flex justify-content-between align-items-center mt-4 mb-4">
                <span className={styles.secureLabel}>
                  <FaLock /> Secure and encrypted payments
                </span>
                <div className="d-flex gap-2">
                  {/* <img src="/api/placeholder/40/25" alt="Visa" className="rounded" /> */}
                  <FaCcVisa size={30} style={{ color: "blue" }} />
                  <FaCcMastercard size={30} style={{ color: "blue" }} />
                  <GiPayMoney size={30} style={{ color: "blue" }} />
                  {/* <img src="/api/placeholder/40/25" alt="Mastercard" className="rounded" />
                  <img src="/api/placeholder/40/25" alt="Amex" className="rounded" /> */}
                </div>
              </div>

              {/* Pay Button */}
              <button className={`btn btn-primary w-100 ${styles.payButton}`}>
                <div className="d-flex align-items-center justify-content-center gap-2">
                  <FaLock size={16} />
                  Pay {total} Securely
                </div>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentPage;
