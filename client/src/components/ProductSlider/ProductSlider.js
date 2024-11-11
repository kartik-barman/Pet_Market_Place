import React, { useState, useEffect } from 'react';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import styles from './ProductSlider.module.css';
import axios from 'axios';

const ProductSlider = () => {
  const [products, setProducts] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [visibleCount, setVisibleCount] = useState(4); // Default to show 4 products on desktop

  // Fetch products from API
  const fetchPet = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/pets");
      const result = res.data;
      setProducts(result.pets);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchPet();

    const handleResize = () => {
      if (window.innerWidth <= 767) {
        setVisibleCount(1); // Show 1 product at a time on mobile
      } else {
        setVisibleCount(4); // Show 4 products at a time on larger screens
      }
    };

    handleResize(); // Call on mount
    window.addEventListener('resize', handleResize); // Re-evaluate on window resize

    return () => window.removeEventListener('resize', handleResize); // Clean up event listener
  }, []);

  // Automatic slider effect
  useEffect(() => {
    const intervalId = setInterval(() => {
      setCurrentIndex((prevIndex) => {
        // Adjust for wrapping around based on visibleCount
        if (visibleCount === 1) {
          return (prevIndex + 1) % products.length; // For mobile, one product at a time
        } else {
          return (prevIndex + 1) % (products.length - visibleCount + 1); // For desktop, wrap after visibleCount
        }
      });
    }, 3000); // Change slide every 3 seconds

    return () => clearInterval(intervalId); // Clean up interval on component unmount
  }, [products.length, visibleCount]);

  // Previous button click handler
  const handlePrevClick = () => {
    setCurrentIndex((prevIndex) => {
      // Adjust for wrapping around when going to the previous slide
      if (visibleCount === 1) {
        return prevIndex === 0 ? products.length - 1 : prevIndex - 1;
      } else {
        return prevIndex === 0 ? products.length - visibleCount : prevIndex - 1;
      }
    });
  };

  // Next button click handler
  const handleNextClick = () => {
    setCurrentIndex((prevIndex) => {
      // Adjust for wrapping around when going to the next slide
      if (visibleCount === 1) {
        return (prevIndex + 1) % products.length; // For mobile, one product at a time
      } else {
        return (prevIndex + 1) % (products.length - visibleCount + 1); // For desktop, wrap after visibleCount
      }
    });
  };

  // Bottom navigation click handler
  const handleSlideClick = (index) => {
    setCurrentIndex(index);
  };

  return (
    <div className={styles.sliderContainer}>
      <button className={styles.prevBtn} onClick={handlePrevClick}>
        <FaChevronLeft />
      </button>
      <div className={styles.productContainer}>
        {products.slice(currentIndex, currentIndex + visibleCount).map((product, index) => (
          <div key={index} className={styles.productCard}>
            <img src={product.images[0]} alt={product.name} className={styles.productImage} />
            <div className={styles.productInfo}>
              <h3 className={styles.productName}>{product.name}</h3>
              <p className={styles.productPrice}>${product.price}</p>
              <button className={styles.addToCartBtn}>Add to Cart</button>
            </div>
          </div>
        ))}
      </div>
      <button className={styles.nextBtn} onClick={handleNextClick}>
        <FaChevronRight />
      </button>

      {/* Bottom navigation for sliding */}
      <div className={styles.bottomNav}>
        {products.map((_, index) => (
          <button
            key={index}
            className={`${styles.navDot} ${currentIndex === index ? styles.activeDot : ''}`}
            onClick={() => handleSlideClick(index)}
          ></button>
        ))}
      </div>
    </div>
  );
};

export default ProductSlider;
