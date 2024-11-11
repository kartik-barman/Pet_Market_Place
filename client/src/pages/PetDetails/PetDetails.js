import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  FaHeart,
  FaMapMarkerAlt,
  FaBirthdayCake,
  FaPaw,
  FaStar,
  FaRegStar,
  FaThumbsUp,
  FaReply,
  FaShare,
  FaShoppingCart,
} from "react-icons/fa";
import styles from "./PetDetails.module.css";
import { Link, useParams } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";

const PetDetails = () => {
  const { petId } = useParams();
  const [pet, setPet] = useState(null);
  const [activeImage, setActiveImage] = useState(0);
  const [commentText, setCommentText] = useState("");
  const [showReplyForm, setShowReplyForm] = useState(null);
  const [replyText, setReplyText] = useState("");
  const token = localStorage.getItem("token");

  useEffect(() => {
    fetchPet();
  }, [petId]);

  const fetchPet = async () => {
    try {
      const res = await axios.get(
        `https://pet-market-place-server.onrender.com/api/pets/${petId}`
      );
      setPet(res.data.pet);
      console.log("orders : ", res.data.pet.orders);
    } catch (err) {
      console.error("Error fetching pet data:", err);
    }
  };

  const handleAddToCart = async () => {
    if (!token) {
      toast.error("Please log in to add items to your cart.");
      return;
    }
    try {
      const res = await axios.put(
        `https://pet-market-place-server.onrender.com/api/users/cart/${petId}`,
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

  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    if (!token) {
      alert("Log in first then try commenting.");
      return;
    }
    try {
      await axios.post(
        `https://pet-market-place-server.onrender.com/api/pets/comment/${petId}`,
        { commentText },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setCommentText("");
      fetchPet();
    } catch (error) {
      console.error("Error submitting comment:", error);
    }
  };

  const handleReplySubmit = async (e, commentId) => {
    e.preventDefault();
    if (!token) {
      alert("Log in first then try replying.");
      return;
    }
    try {
      await axios.post(
        `https://pet-market-place-server.onrender.com/api/pets/comment/${petId}/reply`,
        { commentId, replyText },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setReplyText("");
      setShowReplyForm(null);
      fetchPet();
    } catch (error) {
      console.error("Error submitting reply:", error);
    }
  };

  const renderStars = (rating) => {
    return [...Array(5)].map((_, i) =>
      i < Math.floor(rating) ? (
        <FaStar key={i} className={styles.star} />
      ) : (
        <FaRegStar key={i} className={styles.star} />
      )
    );
  };

  const renderComment = (comment, isReply = false) => (
    <div
      key={comment._id}
      className={`${styles.commentCard} ${isReply ? "ms-5" : ""}`}
    >
      <div className={styles.commentHeader}>
        {comment.user.avatar ? (
          <img
            src={comment.user.avatar}
            alt={comment.user.name}
            className={styles.avatar}
          />
        ) : (
          <div
            className={`bg-primary text-white fw-bold ${styles.avatar} d-flex justify-content-center align-items-center`}
          >
            {comment.user.name[0].toUpperCase()}
          </div>
        )}
        {comment.user.name.charAt(0).toUpperCase() + comment.user.name.slice(1)}
        <span className={styles.commentTime}>
          {new Date(comment.createdAt).toLocaleDateString()}
        </span>
      </div>
      <p className={styles.commentText}>{comment.commentText}</p>

      <div className={styles.commentActions}>
        <button className={styles.commentAction}>
          <FaThumbsUp />
          <span>{comment.likes}</span>
        </button>
        {!isReply && (
          <button
            className={styles.commentAction}
            onClick={() =>
              setShowReplyForm(
                showReplyForm === comment._id ? null : comment._id
              )
            }
          >
            <FaReply />
            <span>Reply</span>
          </button>
        )}
        <button className={styles.commentAction}>
          <FaShare />
          <span>Share</span>
        </button>
      </div>

      {showReplyForm === comment._id && (
        <form
          className={styles.replyForm}
          onSubmit={(e) => handleReplySubmit(e, comment._id)}
        >
          <textarea
            className={styles.commentInput}
            placeholder="Write a reply..."
            rows="2"
            value={replyText}
            onChange={(e) => setReplyText(e.target.value)}
          />
          <button className={`${styles.actionButton} ${styles.adoptButton}`}>
            Post Reply
          </button>
        </form>
      )}

      {comment.replies?.map((reply) => renderComment(reply, true))}
    </div>
  );

  if (!pet) {
    return <div>Loading...</div>;
  }

  return (
    <section className={styles.detailsContainer}>
      <Toaster />
      <div className="container">
        <div className="row">
          <div className="col-lg-6 mb-4">
            <div className={styles.imageGallery}>
              <img
                src={pet.images[activeImage]}
                alt={pet.name}
                className={styles.mainImage}
              />
              <div className={styles.thumbnails}>
                {pet.images.map((img, index) => (
                  <img
                    key={index}
                    src={img}
                    alt={`${pet.name} ${index + 1}`}
                    className={`${styles.thumbnail} ${
                      activeImage === index ? styles.thumbnailActive : ""
                    }`}
                    onClick={() => setActiveImage(index)}
                  />
                ))}
              </div>
            </div>
          </div>

          <div className="col-lg-6">
            <div className={styles.petInfo}>
              <h1 className={styles.petName}>{pet.name}</h1>
              <span className={`${styles.badge} bg-primary`}>Featured</span>
              <span className={`${styles.badge} bg-success`}>Available</span>

              <div className={styles.ratings}>
                {renderStars(pet.rating)}
                <span className={styles.ratingText}>
                  {pet.rating} ({pet.comments.length} reviews)
                </span>
              </div>

              <div className={styles.price}>₹{pet.price}</div>
              <p className={`${styles.price} text-danger`}>
                <Link
                  to={`/profile/${pet.seller._id}`}
                  className="text-decoration-none"
                >
                  Seller: {pet.seller.name}
                </Link>
              </p>
              <ul className={styles.infoList}>
                <li className={styles.infoItem}>
                  <FaPaw className={styles.infoIcon} />
                  <span>{pet.breed}</span>
                </li>
                <li className={styles.infoItem}>
                  <FaBirthdayCake className={styles.infoIcon} />
                  <span>{pet.age}</span>
                </li>
                <li className={styles.infoItem}>
                  <FaMapMarkerAlt className={styles.infoIcon} />
                  <span>{pet.location}</span>
                </li>
              </ul>

              <p className={styles.description}>{pet.description}</p>

              <button
                className={`${styles.actionButton} ${styles.adoptButton}`}
                onClick={handleAddToCart}
              >
                <FaShoppingCart className={`me-2 ${styles.navIcon}`} />
                Add To Cart
              </button>
              <button
                className={`${styles.actionButton} ${styles.contactButton}`}
              >
                <Link
                  to={`/profile/${pet.seller._id}`}
                  className="text-decoration-none"
                >
                  Contact Seller
                </Link>
              </button>
            </div>
          </div>

          <div className="col-12">
            <div className={styles.commentsSection}>
              <h3 className="mb-4">Comments ({pet.comments.length})</h3>
              <form
                className={styles.commentForm}
                onSubmit={handleCommentSubmit}
              >
                <textarea
                  className={styles.commentInput}
                  placeholder="Write a comment..."
                  rows="3"
                  value={commentText}
                  onChange={(e) => setCommentText(e.target.value)}
                />
                <button
                  className={`${styles.actionButton} ${styles.adoptButton}`}
                >
                  Post Comment
                </button>
              </form>

              <div className={styles.commentsList}>
                {pet.comments.map((comment) => renderComment(comment))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PetDetails;
