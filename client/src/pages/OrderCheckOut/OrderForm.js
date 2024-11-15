import React, { useEffect, useState } from "react";
import {
  FaUser,
  FaEnvelope,
  FaPhone,
  FaMapMarkerAlt,
  FaCity,
  FaGlobe,
} from "react-icons/fa";
import "bootstrap/dist/css/bootstrap.min.css";
import styles from "./OrderForm.module.css";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";

const OrderForm = () => {
  const token = localStorage.getItem("token");
  const navigate = useNavigate();
  const [cartItems, setCartItems] = useState([]);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    mobile: "",
    address: "",
    city: "",
    district: "",
    zip: "",
    country: "",
  });

  const fetchCartItems = async () => {
    if (!token) return; // Prevent fetching if not authenticated
    try {
      const res = await axios.get(
        "https://pet-market-place-api-server.vercel.app/api/users/cart/",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setCartItems(res.data.cart);
    } catch (error) {
      console.error("Cart items fetch error:", error);
    }
  };

  useEffect(() => {
    fetchCartItems();
  }, []);

  console.log(cartItems);

  const subtotal = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );
  console.log(subtotal);
  const tax = subtotal * 0.08;
  const shipping = 25;
  const total = subtotal + tax + shipping;

  const amount = total;
  const currency = "INR";

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (Object.values(formData).some((field) => !field)) {
      alert("All fields are required");
      return;
    }

    try {
      // Prepare order items from cart
      const orderItems = cartItems.map((item) => ({
        productId: item.item._id, // Reference to Pet model
        quantity: item.quantity,
        price: item.price,
      }));

      const response = await axios.post(
        "https://pet-market-place-api-server.vercel.app/api/users/order",
        { amount, currency }
      );
      const { order_id } = response.data;

      const options = {
        key: "rzp_test_X9JVIoTue0AE1k",
        total,
        currency,
        name: "Pet Marketplace",
        description: "Test Transaction",
        image:
          "https://cdn.dribbble.com/users/4953373/screenshots/11008972/petpal_logo-01_4x.jpg",
        order_id,
        handler: async (response) => {
          toast.success(
            `Payment successful! Payment ID: ${response.razorpay_payment_id}`
          );
          // Redirect to the cart page on successful payment
          navigate("/cart");
          try {
            const res = await axios.delete(
              `https://pet-market-place-api-server.vercel.app/api/users/cart/items`,
              {
                headers: {
                  Authorization: `Bearer ${token}`,
                },
              }
            );
            const { success, msg } = res.data;
            console.log(res.data);
          } catch (error) {
            console.error("Error removing item:", error);
          }
          // Once payment is successful, send the order to the backend
          try {
            const paymentSuccessResponseSent = await axios.post(
              "https://pet-market-place-api-server.vercel.app/api/users/pet/order/create",
              {
                items: orderItems,
                paymentStatus: response.razorpay_payment_status,
                totalAmount: total,
                shippingAddress: {
                  address: formData.address,
                  city: formData.city,
                  dist: formData.district,
                  zip: formData.zip,
                  country: formData.country,
                },
              },
              {
                headers: {
                  Authorization: `Bearer ${token}`,
                },
              }
            );
            console.log(
              "Order successfully submitted:",
              paymentSuccessResponseSent
            );
          } catch (error) {
            console.error("Order submit error:", error);
          }
        },
        prefill: {
          name: `${formData.firstName} ${formData.lastName}`,
          email: formData.email,
          contact: formData.mobile,
        },
        notes: { address: "Razorpay Corporate Office" },
        theme: { color: "#3399cc" },
      };

      const rzp1 = new window.Razorpay(options);
      rzp1.on("payment.failed", (response) => {
        toast.error(`Payment Failed: ${response.error.description}`);
      });
      rzp1.open();
    } catch (error) {
      console.error("Error creating order:", error);
      toast.error("Failed to initiate payment");
    }

    setFormData({
      firstName: "",
      lastName: "",
      email: "",
      mobile: "",
      address: "",
      city: "",
      district: "",
      zip: "",
      country: "",
    });
  };

  return (
    <div className={`container-fluid py-5 ${styles.formContainer}`}>
      <Toaster />
      <div className="container">
        <div className={`card ${styles.formCard}`}>
          <div className="card-body">
            <h2 className={`mb-4 ${styles.formTitle}`}>Payment Checkout</h2>

            <form onSubmit={handleSubmit}>
              {/* Personal Information */}
              <div className={`mb-4 p-4 rounded ${styles.section}`}>
                <h3 className={styles.sectionTitle}>Personal Information</h3>
                <div className="row g-3">
                  <div className="col-md-6">
                    <div className={styles.inputGroup}>
                      <span className={styles.inputIcon}>
                        <FaUser />
                      </span>
                      <input
                        type="text"
                        name="firstName"
                        className={`form-control ${styles.formInput}`}
                        placeholder="First Name"
                        value={formData.firstName}
                        onChange={handleChange}
                        required
                      />
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className={styles.inputGroup}>
                      <span className={styles.inputIcon}>
                        <FaUser />
                      </span>
                      <input
                        type="text"
                        name="lastName"
                        className={`form-control ${styles.formInput}`}
                        placeholder="Last Name"
                        value={formData.lastName}
                        onChange={handleChange}
                        required
                      />
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className={styles.inputGroup}>
                      <span className={styles.inputIcon}>
                        <FaEnvelope />
                      </span>
                      <input
                        type="email"
                        name="email"
                        className={`form-control ${styles.formInput}`}
                        placeholder="Email Address"
                        value={formData.email}
                        onChange={handleChange}
                        required
                      />
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className={styles.inputGroup}>
                      <span className={styles.inputIcon}>
                        <FaPhone />
                      </span>
                      <input
                        type="tel"
                        name="mobile"
                        className={`form-control ${styles.formInput}`}
                        placeholder="Mobile Number"
                        value={formData.mobile}
                        onChange={handleChange}
                        required
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Address Information */}
              <div className={`mb-4 p-4 rounded ${styles.section}`}>
                <h3 className={styles.sectionTitle}>Address Information</h3>
                <div className="row g-3">
                  <div className="col-12">
                    <div className={styles.inputGroup}>
                      <span className={styles.inputIcon}>
                        <FaMapMarkerAlt />
                      </span>
                      <input
                        type="text"
                        name="address"
                        className={`form-control ${styles.formInput}`}
                        placeholder="Street Address"
                        value={formData.address}
                        onChange={handleChange}
                        required
                      />
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className={styles.inputGroup}>
                      <span className={styles.inputIcon}>
                        <FaCity />
                      </span>
                      <input
                        type="text"
                        name="city"
                        className={`form-control ${styles.formInput}`}
                        placeholder="City"
                        value={formData.city}
                        onChange={handleChange}
                        required
                      />
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className={styles.inputGroup}>
                      <span className={styles.inputIcon}>
                        <FaMapMarkerAlt />
                      </span>
                      <input
                        type="text"
                        name="district"
                        className={`form-control ${styles.formInput}`}
                        placeholder="District"
                        value={formData.district}
                        onChange={handleChange}
                        required
                      />
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className={styles.inputGroup}>
                      <span className={styles.inputIcon}>
                        <FaMapMarkerAlt />
                      </span>
                      <input
                        type="text"
                        name="zip"
                        className={`form-control ${styles.formInput}`}
                        placeholder="ZIP Code"
                        value={formData.zip}
                        onChange={handleChange}
                        required
                      />
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className={styles.inputGroup}>
                      <span className={styles.inputIcon}>
                        <FaGlobe />
                      </span>
                      <input
                        type="text"
                        name="country"
                        className={`form-control ${styles.formInput}`}
                        placeholder="Country"
                        value={formData.country}
                        onChange={handleChange}
                        required
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                className={`btn btn-primary ${styles.submitButton}`}
              >
                Pay ₹{total}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderForm;
