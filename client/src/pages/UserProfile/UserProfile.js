import React, { useEffect, useRef, useState } from "react";
import {
  FaUser,
  FaEnvelope,
  FaPhone,
  FaMapMarkerAlt,
  FaCalendarAlt,
  FaHeart,
  FaComment,
  FaStar,
  FaMedal,
  FaPaw,
  FaCamera,
  FaEdit,
} from "react-icons/fa";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";
import styles from "./UserProfile.module.css";
import { Link } from "react-router-dom";

const UserProfile = () => {
  const token = localStorage.getItem("token");
  const userType = localStorage.getItem("role");
  const avatarFileInputRef = useRef(null);
  const bannerFileInputRef = useRef(null);

  const [editMode, setEditMode] = useState(false);
  const [user, setUser] = useState(null);
  const [avatar, setAvatar] = useState(null);
  const [banner, setBanner] = useState(null);
  const [userInfo, setUserInfo] = useState({
    name: "",
    email: "",
    phone: "",
    location: "",
    joinDate: "January 2024",
    about: "",
    stats: {
      pets: 0,
      reviews: 0,
      favorites: 0,
      messages: 0,
    },
    badges: [],
    pets: [],
  });
  const [isLoading, setIsLoading] = useState(true);

  const orders = [
    {
      name: "luchi",
      price: 5000,
      status: "ordered",
      date: "10/15/2024",
    },
    {
      name: "Belly",
      price: 5000,
      status: "pending",
      date: "10/15/2024",
    },
    {
      name: "king",
      price: 5000,
      status: "deliverd",
      date: "10/15/2024",
    },
  ];
  const fetchUser = async () => {
    try {
      const res = await axios.get(
        "https://pet-market-place-server.onrender.com/api/users/user",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const { user } = res.data;
      // console.log(res.data.user.orders[0].items[0].productId);
      console.log(user);
      setUser(user);
      setUserInfo({
        name: user?.name || "",
        email: user?.email || "",
        phone: user?.phone || "",
        location: user?.location || "",
        about: user?.about || "",
        stats: {
          pets: user?.pets?.length || 0,
          reviews: user?.reviews || 0,
          favorites: user?.favorites || 0,
          messages: user?.messages || 0,
        },
        badges: user?.badges || [],
        pets: user?.pets || [],
      });
      setAvatar(user.avatar);
      setIsLoading(false);
    } catch (error) {
      console.error("Error fetching user data:", error);
      toast.error("Failed to load user data. Please try again.");
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);

  const handleFileChange = (e, type) => {
    const file = e.target.files[0];
    if (file && file.size > 5000000) {
      toast.error("File is too large. Max size is 5MB.");
      return;
    }
    if (type === "avatar") {
      setAvatar(file);
    } else if (type === "banner") {
      setBanner(file);
    }
  };

  const handleEditMode = () => {
    setEditMode(true);
  };

  const handleSave = async () => {
    setEditMode(false); // Exit edit mode after saving

    const formData = new FormData();
    formData.append("name", userInfo.name);
    formData.append("email", userInfo.email);
    formData.append("phone", userInfo.phone);
    formData.append("location", userInfo.location);
    formData.append("about", userInfo.about);

    if (avatar) formData.append("avatar", avatar);
    if (banner) formData.append("banner", banner);

    try {
      const res = await axios.post(
        "http://localhost:5000/api/users/update-profile",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log(res.data);
      toast.success("Profile updated successfully!");
      fetchUser();
    } catch (error) {
      console.error("Profile update error:", error);
      toast.error("Failed to update profile. Please try again.");
    }
  };

  const createdAt = user?.createdAt;
  const date = new Date(createdAt);
  const formattedDate = date.toLocaleString("en-US", {
    month: "long",
    year: "numeric",
  });

  if (isLoading) {
    return <div>Loading...</div>;
  }

  const getStatusBadge = (status) => {
    switch (status) {
      case "Delivered":
        return "badge bg-success";
      case "Pending":
        return "badge bg-warning text-dark";
      case "Cancelled":
        return "badge bg-danger";
      case "Shipped":
        return "badge bg-info";
      case "Out For Delivery":
        return "badge bg-primary";
      default:
        return "badge bg-secondary";
    }
  };

  return (
    <>
      <Toaster />
      <div className="container py-5">
        <div className={`card ${styles.profileCard}`}>
          {/* Banner and Profile Photo */}
          <div className={styles.profileBanner}>
            <img
              src={user?.banner}
              alt="Profile Banner"
              className={`${styles.bannerImg} w-100`}
            />
            <div className={styles.editBanner}>
              {editMode && (
                <button
                  className="btn btn-light btn-sm"
                  onClick={() => bannerFileInputRef.current.click()}
                >
                  <FaCamera /> Edit Cover
                </button>
              )}
              <input
                type="file"
                onChange={(e) => handleFileChange(e, "banner")}
                ref={bannerFileInputRef}
                style={{ display: "none" }}
              />
            </div>
          </div>

          <div className="card-body">
            <div className={styles.profileHeader}>
              <div className={styles.profilePhoto}>
                {avatar ? (
                  <img
                    src={
                      typeof avatar === "string"
                        ? avatar
                        : URL.createObjectURL(avatar)
                    }
                    alt="Profile"
                    style={{
                      width: "120px",
                      height: "120px",
                      borderRadius: "100%",
                    }}
                  />
                ) : (
                  <FaUser size={60} className="text-secondary" />
                )}
                {editMode && (
                  <button
                    className={`btn btn-primary btn-sm ${styles.editPhoto}`}
                    onClick={() => avatarFileInputRef.current.click()}
                  >
                    <FaCamera />
                  </button>
                )}
                <input
                  type="file"
                  onChange={(e) => handleFileChange(e, "avatar")}
                  ref={avatarFileInputRef}
                  style={{ display: "none" }}
                />
              </div>
              <div className={styles.profileInfo}>
                {editMode ? (
                  <input
                    type="text"
                    value={userInfo.name}
                    className="mt-5"
                    onChange={(e) =>
                      setUserInfo({ ...userInfo, name: e.target.value })
                    }
                  />
                ) : (
                  <h1 className="h3 mb-2 mt-5">{user?.name}</h1>
                )}
                {editMode ? (
                  <>
                    <br />
                    <input
                      type="text"
                      value={userInfo?.location}
                      placeholder="Enter Your Location"
                      className="mt-2 mb-3"
                      onChange={(e) =>
                        setUserInfo({ ...userInfo, location: e.target.value })
                      }
                    />
                    <br />
                  </>
                ) : (
                  <p className="text-muted mb-3">
                    <FaMapMarkerAlt className="me-2" />
                    {user?.location || "location"}
                  </p>
                )}
                {editMode ? (
                  <button
                    className="btn btn-success btn-sm"
                    onClick={handleSave}
                  >
                    Save
                  </button>
                ) : (
                  <button
                    className="btn btn-outline-primary btn-sm"
                    onClick={handleEditMode}
                  >
                    <FaEdit className="me-2" />
                    Edit Profile
                  </button>
                )}
              </div>
            </div>

            {/* Contact Information */}
            <div className="row mt-4">
              <div className="col-md-6 mb-3">
                <div className={styles.contactItem}>
                  {editMode ? (
                    <input
                      type="email"
                      value={userInfo.email}
                      className="bg-transparent border-0 w-100"
                      style={{ outline: "none" }}
                      onChange={(e) =>
                        setUserInfo({ ...userInfo, email: e.target.value })
                      }
                    />
                  ) : (
                    <>
                      <FaEnvelope className={styles.contactIcon} />
                      <span>{user?.email}</span>
                    </>
                  )}
                </div>
              </div>
              <div className="col-md-6 mb-3">
                <div className={styles.contactItem}>
                  {editMode ? (
                    <input
                      type="text"
                      value={userInfo.phone}
                      className="bg-transparent border-0 w-100"
                      style={{ outline: "none" }}
                      onChange={(e) =>
                        setUserInfo({ ...userInfo, phone: e.target.value })
                      }
                    />
                  ) : (
                    <>
                      <FaPhone className={styles.contactIcon} />
                      <span>{user?.phone}</span>
                    </>
                  )}
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
                  <div className={styles.statCount}>{userInfo.stats.pets}</div>
                  <div className={styles.statLabel}>Pets</div>
                </div>
              </div>
              <div className="col-6 col-md-3 mb-3">
                <div className={styles.statCard}>
                  <FaStar className={styles.statIcon} />
                  <div className={styles.statCount}>
                    {userInfo.stats.reviews}
                  </div>
                  <div className={styles.statLabel}>Reviews</div>
                </div>
              </div>
              <div className="col-6 col-md-3 mb-3">
                <div className={styles.statCard}>
                  <FaHeart className={styles.statIcon} />
                  <div className={styles.statCount}>
                    {userInfo.stats.favorites}
                  </div>
                  <div className={styles.statLabel}>Favorites</div>
                </div>
              </div>
              <div className="col-6 col-md-3 mb-3">
                <div className={styles.statCard}>
                  <FaComment className={styles.statIcon} />
                  <div className={styles.statCount}>
                    {userInfo.stats.messages}
                  </div>
                  <div className={styles.statLabel}>Messages</div>
                </div>
              </div>
            </div>

            {/* About Section */}
            <div className="mt-4">
              <h5>About</h5>
              {editMode ? (
                <textarea
                  value={userInfo.about}
                  onChange={(e) =>
                    setUserInfo({ ...userInfo, about: e.target.value })
                  }
                  className="form-control"
                  rows="3"
                />
              ) : (
                <p>{user?.about}</p>
              )}
            </div>

            {userType === "Buyer" && (
              <div className="mt-4">
                <h5>My Orders</h5>
                {user?.orders && user.orders.length === 0 ? (
                  <p className="text-muted">No orders available.</p>
                ) : (
                  <div className="d-flex flex-wrap">
                    {user?.orders.map((order, index) => (
                      <div
                        key={index}
                        className="card m-2 order-card"
                        style={{ width: "18rem" }}
                      >
                        <div
                          className="card-body"
                          style={{
                            backgroundColor:
                              order.orderStatus === "Ordered"
                                ? "#f0f8ff"
                                : "#fffacd",
                          }}
                        >
                          <p className="card-title">Order id : #{order._id}</p>
                          <p className="card-text">
                            <strong>Status: </strong>
                            <span
                              className={`${getStatusBadge(order.orderStatus)}`}
                            >
                              {order.orderStatus}
                            </span>
                          </p>
                          <p className="text-muted">
                            <strong>Total Amount:</strong> ₹{order.totalAmount}{" "}
                          </p>
                          <p className="text-muted">
                            <strong>Shipping Address:</strong>
                            <br />
                            {order.shippingAddress.address},{" "}
                            {order.shippingAddress.city},{" "}
                            {order.shippingAddress.dist},
                            {order.shippingAddress.zip},{" "}
                            {order.shippingAddress.country}
                          </p>
                          <div>
                            <h6>Items Ordered:</h6>
                            {order.items.map((item, index) => (
                              <div
                                key={index}
                                className="d-flex align-items-center mb-2"
                              >
                                <img
                                  src={item.productId.images[0]}
                                  alt={item.productId.name}
                                  style={{
                                    width: "50px",
                                    height: "50px",
                                    objectFit: "cover",
                                    borderRadius: "5px",
                                    marginRight: "10px",
                                  }}
                                  className="mr-2"
                                />
                                <div>
                                  <p className="mb-0">
                                    <strong>{item.productId.name}</strong>
                                  </p>
                                  <p className="mb-0">
                                    Quantity: {item.quantity}
                                  </p>
                                  <p className="mb-0">Price: ₹ {item.price}</p>
                                </div>
                              </div>
                            ))}
                          </div>
                          <button
                            className="btn btn-primary"
                            onClick={() =>
                              alert("Order details will be shown here.")
                            }
                          >
                            View Details
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {userType !== "Buyer" && (
              <>
                {/* Badges Section */}
                <div className="mt-4">
                  <h5>Badges</h5>
                  <div className="d-flex flex-wrap">
                    {userInfo.badges.map((badge, index) => (
                      <div
                        key={index}
                        className="badge badge-pill badge-primary me-2 mb-2"
                      >
                        {badge}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Pets Owned Section */}
                <div className="mt-4">
                  <h5>Pets</h5>
                  <div className="d-flex flex-wrap">
                    {userInfo.pets.map((pet, index) => (
                      <Link
                        to={`/all/orders/${pet._id}`}
                        className="text-decoration-none"
                        key={index}
                      >
                        <div
                          className="card m-2"
                          style={{ width: "18rem", maxHeight: "300px" }}
                        >
                          <img
                            src={pet?.images[0]}
                            className="card-img-top"
                            alt={pet.name}
                            style={{ maxHeight: "150px" }}
                          />
                          <div className="card-body">
                            <h5 className="card-title">{pet.name}</h5>
                            <p className="card-text">{pet.description}</p>
                            <p>{pet.age} old</p>
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default UserProfile;
