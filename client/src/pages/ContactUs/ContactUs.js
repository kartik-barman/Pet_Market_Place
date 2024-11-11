import React, { useState } from "react";
import {
  FaPhoneAlt,
  FaEnvelope,
  FaMapMarkerAlt,
  FaClock,
  FaFacebook,
  FaTwitter,
  FaInstagram,
  FaLinkedin,
  FaWhatsapp,
  FaPaw,
} from "react-icons/fa";
import styles from "./ContactUs.module.css";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";

const ContactUs = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    topic: "",
    message: "",
  });

  // Handle form input changes dynamically
  const handleChangeInput = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value, // Dynamically update the correct field
    }));
  };

  const handleFormSubmit = async (e) => {
    if (
      !formData.name ||
      !formData.email ||
      !formData.topic ||
      !formData.message
    ) {
      alert("All field are required");
    }
    e.preventDefault();
    try {
      const res = await axios.post(
        "https://pet-market-place-server.onrender.com/api/users/contact",
        formData
      );
      const result = res.data;
      const { success, msg } = result;
      if (success) {
        toast.success(msg);
      } else {
        toast.error(msg);
      }
    } catch (error) {
      console.error(error);
    }

    setFormData({
      name: "",
      email: "",
      topic: "",
      message: "",
    });
  };

  const contactInfo = [
    {
      icon: <FaPhoneAlt />,
      title: "Phone Support",
      details: ["+91 865333674 PET-LOVE", "+91 123456789"],
      action: "Call Now",
    },
    {
      icon: <FaEnvelope />,
      title: "Email",
      details: ["support@petpal.com", "info@petpal.com"],
      action: "Send Email",
    },
    {
      icon: <FaMapMarkerAlt />,
      title: "Location",
      details: ["736146 Sitalkhuchi Road", "Mathabhanga, Coochbehar"],
      action: "Get Directions",
    },
    {
      icon: <FaClock />,
      title: "Business Hours",
      details: [
        "Mon - Fri: 9:00 AM - 8:00 PM",
        "Sat - Sun: 10:00 AM - 6:00 PM",
      ],
      action: "View Hours",
    },
  ];

  const faqs = [
    {
      question: "How do I list my pet for adoption?",
      answer:
        "Create an account, verify your identity, and follow our simple pet listing process. Well guide you through each step.",
    },
    {
      question: "What are the adoption fees?",
      answer:
        "Adoption fees vary by pet and seller. Each listing includes transparent fee information and what it covers.",
    },
    {
      question: "Is there a return policy?",
      answer:
        "We work with adopters and sellers to ensure the best outcomes. Contact us within 14 days if you have concerns.",
    },
    {
      question: "How do you verify sellers?",
      answer:
        "We conduct thorough background checks, verify licenses, and regularly monitor seller activities to ensure safety.",
    },
  ];

  return (
    <div className="container-fluid p-0">
      {/* Hero Section */}
      <Toaster />
      <div className={styles.heroSection}>
        <div className="container">
          <div className="row justify-content-center text-center">
            <div className="col-lg-8">
              <h1 className={styles.heroTitle}>Get in Touch</h1>
              <p className={styles.heroText}>
                Have questions about adopting a pet or need support? We're here
                to help make your pet journey amazing.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Contact Info Cards */}
      <div className={`${styles.contactSection} py-5`}>
        <div className="container">
          <div className="row g-4">
            {contactInfo.map((info, index) => (
              <div key={index} className="col-md-6 col-lg-3">
                <div className={styles.contactCard}>
                  <div className={styles.contactIcon}>{info.icon}</div>
                  <h3 className={styles.contactTitle}>{info.title}</h3>
                  {info.details.map((detail, idx) => (
                    <p key={idx} className={styles.contactDetail}>
                      {detail}
                    </p>
                  ))}
                  <button
                    className={`btn btn-outline-primary ${styles.actionButton}`}
                  >
                    {info.action}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Contact Form Section */}
      <div className={`${styles.formSection} py-5`}>
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-lg-10">
              <div className={styles.formWrapper}>
                <div className="row">
                  <div className="col-md-6 mb-4 mb-md-0">
                    <div className={styles.formContent}>
                      <h2 className={styles.formTitle}>Send Us a Message</h2>
                      <p className={styles.formText}>
                        Fill out the form and our team will get back to you
                        within 24 hours.
                      </p>
                      <div className={styles.socialLinks}>
                        <a href="#" className={styles.socialIcon}>
                          <FaFacebook />
                        </a>
                        <a href="#" className={styles.socialIcon}>
                          <FaTwitter />
                        </a>
                        <a href="#" className={styles.socialIcon}>
                          <FaInstagram />
                        </a>
                        <a href="#" className={styles.socialIcon}>
                          <FaLinkedin />
                        </a>
                      </div>
                      <div className={styles.decorationIcon}>
                        <FaPaw />
                      </div>
                    </div>
                  </div>
                  <div className="col-md-6">
                    <form
                      className={styles.contactForm}
                      onSubmit={handleFormSubmit}
                    >
                      <div className="mb-3">
                        <input
                          type="text"
                          name="name" // Add name attribute
                          value={formData.name}
                          className="form-control"
                          placeholder="Your Name"
                          onChange={handleChangeInput}
                        />
                      </div>
                      <div className="mb-3">
                        <input
                          type="email"
                          name="email" // Add name attribute
                          value={formData.email}
                          className="form-control"
                          placeholder="Your Email"
                          onChange={handleChangeInput}
                        />
                      </div>
                      <div className="mb-3">
                        <select
                          name="topic" // Add name attribute
                          className="form-select"
                          onChange={handleChangeInput}
                          value={formData.topic}
                        >
                          <option>Select Topic</option>
                          <option value="Adoption Process">
                            Adoption Process
                          </option>
                          <option value="Pet Listing">Pet Listing</option>
                          <option value="Account Support">
                            Account Support
                          </option>
                          <option value="Other">Other</option>
                        </select>
                      </div>
                      <div className="mb-3">
                        <textarea
                          name="message" // Add name attribute
                          className="form-control"
                          rows="4"
                          placeholder="Your Message"
                          value={formData.message}
                          onChange={handleChangeInput}
                        ></textarea>
                      </div>
                      <button type="submit" className="btn btn-primary w-100">
                        Send Message
                      </button>
                    </form>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* FAQ Section */}
      <div className={`${styles.faqSection} py-5`}>
        <div className="container">
          <h2 className={`${styles.sectionTitle} text-center mb-5`}>
            Frequently Asked Questions
          </h2>
          <div className="row justify-content-center">
            <div className="col-lg-8">
              <div className="accordion" id="faqAccordion">
                {faqs.map((faq, index) => (
                  <div
                    key={index}
                    className={`accordion-item ${styles.faqItem}`}
                  >
                    <h3 className="accordion-header">
                      <button
                        className={`accordion-button ${
                          index !== 0 ? "collapsed" : ""
                        }`}
                        type="button"
                        data-bs-toggle="collapse"
                        data-bs-target={`#faq${index}`}
                      >
                        {faq.question}
                      </button>
                    </h3>
                    <div
                      id={`faq${index}`}
                      className={`accordion-collapse collapse ${
                        index === 0 ? "show" : ""
                      }`}
                      data-bs-parent="#faqAccordion"
                    >
                      <div className="accordion-body">{faq.answer}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Map Section */}
      <div className={styles.mapSection}>
        <div className="container-fluid p-0">
          <div className={styles.mapWrapper}>
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m14!1m12!1m3!1d14754.508495908549!2d88.04118975!3d22.4054101!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!5e0!3m2!1sen!2sin!4v1731188935647!5m2!1sen!2sin"
              style={{ border: "0", width: "100%", height: "400px" }}
              allowfullscreen=""
              loading="lazy"
              referrerpolicy="no-referrer-when-downgrade"
            ></iframe>
            <div className={styles.mapOverlay}>
              <div className={styles.quickContact}>
                <h3>Need Immediate Help?</h3>
                <a
                  href="https://wa.me/8653336744"
                  className={styles.whatsappButton}
                >
                  <FaWhatsapp /> Chat on WhatsApp
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactUs;
