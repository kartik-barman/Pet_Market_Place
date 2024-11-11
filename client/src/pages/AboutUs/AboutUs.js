// AboutUs.js
import React from 'react';
import { 
  FaPaw, 
  FaHeart, 
  FaHandHoldingHeart, 
  FaUsers, 
  FaMedal,
  FaCheckCircle,
  FaPhoneAlt,
  FaEnvelope,
  FaMapMarkerAlt
} from 'react-icons/fa';
import styles from './AboutUs.module.css';

const AboutUs = () => {
  const stats = [
    { icon: <FaUsers />, count: '50,000+', label: 'Happy Pet Parents' },
    { icon: <FaPaw />, count: '100,000+', label: 'Pets Listed' },
    { icon: <FaHeart />, count: '25,000+', label: 'Successful Adoptions' },
    { icon: <FaMedal />, count: '1,000+', label: 'Verified Breeders' }
  ];

  const features = [
    {
      title: 'Trusted Community',
      description: 'Our marketplace ensures every breeder and seller is thoroughly verified for the safety of all pets.',
      icon: <FaCheckCircle className={styles.featureIcon} />
    },
    {
      title: 'Pet Support',
      description: 'We provide ongoing support and resources for both new and experienced pet parents.',
      icon: <FaHandHoldingHeart className={styles.featureIcon} />
    },
    {
      title: 'Safe Adoptions',
      description: 'Our adoption process is designed to ensure pets find their perfect forever homes.',
      icon: <FaHeart className={styles.featureIcon} />
    }
  ];

  const team = [
    {
      name: 'Mr. Kartik Barman',
      role: 'Founder & CEO',
      image: 'https://res.cloudinary.com/dewwngmuf/image/upload/v1730493114/dhtu4a1dvusglybhxxav.png',
      bio: 'Professional Web Developer now internship at CodeClause Company'
    },
    {
      name: 'Mr. Arijit Mondol',
      role: 'Head of Operations',
      image: 'https://res.cloudinary.com/dewwngmuf/image/upload/v1731183880/user_profile_picture/pkd467p1zbyjoal8cuww.jpg',
      bio: 'Former shelter manager with passion for animal welfare'
    },
    {
      name: 'Mr. Krishna Paul',
      role: 'Community Manager',
      image: 'https://res.cloudinary.com/dewwngmuf/image/upload/v1731188220/WhatsApp_Image_2024-11-10_at_03.03.40_2bb934c9_gtqhys.jpg',
      bio: 'Dedicated to building strong pet-loving communities'
    }
  ];

  return (
    <div className="container-fluid p-0">
      {/* Hero Section */}
      <div className={styles.heroSection}>
        <div className="container">
          <div className="row align-items-center min-vh-75">
            <div className="col-lg-6">
              <h1 className={styles.heroTitle}>
                Connecting Pets <br />
                with Loving Homes
              </h1>
              <p className={styles.heroText}>
                We're more than just a marketplace - we're a community dedicated to 
                bringing pets and people together in a safe, trustworthy environment.
              </p>
              <button className="btn btn-primary btn-lg">Join Our Community</button>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className={`${styles.statsSection} py-5`}>
        <div className="container">
          <div className="row">
            {stats.map((stat, index) => (
              <div key={index} className="col-md-3 col-6 mb-4">
                <div className={styles.statCard}>
                  <div className={styles.statIcon}>{stat.icon}</div>
                  <div className={styles.statCount}>{stat.count}</div>
                  <div className={styles.statLabel}>{stat.label}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Mission Section */}
      <div className={`${styles.missionSection} py-5`}>
        <div className="container">
          <div className="row align-items-center">
            <div className="col-lg-6 mb-4 mb-lg-0">
              <img 
                src="https://res.cloudinary.com/dewwngmuf/image/upload/v1730486369/cld-sample.jpg" 
                alt="Happy pets" 
                className="img-fluid rounded-3 shadow"
              />
            </div>
            <div className="col-lg-6">
              <h2 className={styles.sectionTitle}>Our Mission</h2>
              <div className={styles.missionText}>
                <p>
                  At PetMarket, our mission is to revolutionize the way people find 
                  and adopt pets. We believe every pet deserves a loving home, and 
                  every person deserves to experience the joy of pet companionship.
                </p>
                <p>
                  We strive to create a safe, transparent, and enjoyable platform 
                  that brings together responsible breeders, animal lovers, and pets 
                  in need of homes.
                </p>
              </div>
              <div className={styles.featureList}>
                {features.map((feature, index) => (
                  <div key={index} className={styles.featureItem}>
                    {feature.icon}
                    <div>
                      <h3 className={styles.featureTitle}>{feature.title}</h3>
                      <p className={styles.featureDesc}>{feature.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Team Section */}
      <div className={`${styles.teamSection} py-5`}>
        <div className="container">
          <h2 className={`${styles.sectionTitle} text-center mb-5`}>
            Meet Our Team
          </h2>
          <div className="row">
            {team.map((member, index) => (
              <div key={index} className="col-lg-4 col-md-6 mb-4">
                <div className={styles.teamCard}>
                  <div className={styles.teamImageWrapper}>
                    <img 
                      src={member.image} 
                      alt={member.name} 
                      className={styles.teamImage}
                    />
                  </div>
                  <div className={styles.teamInfo}>
                    <h3 className={styles.teamName}>{member.name}</h3>
                    <div className={styles.teamRole}>{member.role}</div>
                    <p className={styles.teamBio}>{member.bio}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Contact Section */}
      {/* <div className={`${styles.contactSection} py-5`}>
        <div className="container">
          <div className="row align-items-center">
            <div className="col-lg-6 mb-4 mb-lg-0">
              <h2 className={styles.sectionTitle}>Get in Touch</h2>
              <p className={styles.contactText}>
                Have questions about our platform or need support? 
                We're here to help you and your furry friends.
              </p>
              <div className={styles.contactInfo}>
                <div className={styles.contactItem}>
                  <FaPhoneAlt className={styles.contactIcon} />
                  <span>+91 8653336744</span>
                </div>
                <div className={styles.contactItem}>
                  <FaEnvelope className={styles.contactIcon} />
                  <span>support@petpal.com</span>
                </div>
                <div className={styles.contactItem}>
                  <FaMapMarkerAlt className={styles.contactIcon} />
                  <span>Mathabhnaga, Coochbehar, West Bengal</span>
                </div>
              </div>
            </div>
            <div className="col-lg-6">
              <form className={styles.contactForm}>
                <div className="mb-3">
                  <input 
                    type="text" 
                    className="form-control" 
                    placeholder="Your Name" 
                  />
                </div>
                <div className="mb-3">
                  <input 
                    type="email" 
                    className="form-control" 
                    placeholder="Your Email" 
                  />
                </div>
                <div className="mb-3">
                  <textarea 
                    className="form-control" 
                    rows="4" 
                    placeholder="Your Message"
                  ></textarea>
                </div>
                <button type="submit" className="btn btn-primary w-100">
                  Send Message
                </button>
              </form>
            </div>
          </div>
        </div>
      </div> */}
    </div>
  );
};

export default AboutUs;