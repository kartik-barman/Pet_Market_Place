// Footer.jsx
import React, { useState } from "react";
import {
  Facebook,
  Instagram,
  Twitter,
  Youtube,
  Mail,
  Phone,
  MapPin,
} from "lucide-react";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";

const Footer = () => {
  const getCurrentYear = () => new Date().getFullYear();
  const [email, setEmail] = useState("");
  const handleSubscibeBtn = async () => {
    try {
      const res = await axios.post(
        "https://pet-market-place-server.onrender.com/api/users/subscribe",
        {
          email,
        }
      );
      const result = res.data;
      console.log(result);
      const { success, msg } = result;
      if (success) {
        toast.success(msg);
      } else {
        toast.error(msg);
      }
    } catch (error) {
      console.error(error);
    }
  };
  return (
    <footer className="bg-dark text-white pt-5 pb-4">
      <Toaster />
      <div className="container">
        <div className="row">
          {/* About Section */}
          <div className="col-lg-3 col-md-6 mb-4">
            <h5 className="text-uppercase mb-4 font-weight-bold">PetPal</h5>
            <p>
              Your one-stop destination for all pet needs. We provide quality
              products and services to ensure your furry friends live their best
              lives.
            </p>
            <div className="d-flex gap-3 mb-4">
              <Facebook
                className="hover:text-blue-400 cursor-pointer transition-colors"
                size={24}
              />
              <Instagram
                className="hover:text-pink-400 cursor-pointer transition-colors"
                size={24}
              />
              <Twitter
                className="hover:text-blue-500 cursor-pointer transition-colors"
                size={24}
              />
              <Youtube
                className="hover:text-red-500 cursor-pointer transition-colors"
                size={24}
              />
            </div>
          </div>

          {/* Quick Links */}
          <div className="col-lg-3 col-md-6 mb-4">
            <h5 className="text-uppercase mb-4 font-weight-bold">
              Quick Links
            </h5>
            <ul className="list-unstyled">
              <li className="mb-2">
                <a
                  href="#"
                  className="text-white text-decoration-none hover:text-gray-300"
                >
                  Home
                </a>
              </li>
              <li className="mb-2">
                <a
                  href="#"
                  className="text-white text-decoration-none hover:text-gray-300"
                >
                  Shop
                </a>
              </li>
              <li className="mb-2">
                <a
                  href="#"
                  className="text-white text-decoration-none hover:text-gray-300"
                >
                  Services
                </a>
              </li>
              <li className="mb-2">
                <a
                  href="#"
                  className="text-white text-decoration-none hover:text-gray-300"
                >
                  Blog
                </a>
              </li>
            </ul>
          </div>

          {/* Services */}
          <div className="col-lg-3 col-md-6 mb-4">
            <h5 className="text-uppercase mb-4 font-weight-bold">Services</h5>
            <ul className="list-unstyled">
              <li className="mb-2">
                <a
                  href="#"
                  className="text-white text-decoration-none hover:text-gray-300"
                >
                  Pet Grooming
                </a>
              </li>
              <li className="mb-2">
                <a
                  href="#"
                  className="text-white text-decoration-none hover:text-gray-300"
                >
                  Veterinary Care
                </a>
              </li>
              <li className="mb-2">
                <a
                  href="#"
                  className="text-white text-decoration-none hover:text-gray-300"
                >
                  Pet Training
                </a>
              </li>
              <li className="mb-2">
                <a
                  href="#"
                  className="text-white text-decoration-none hover:text-gray-300"
                >
                  Pet Boarding
                </a>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div className="col-lg-3 col-md-6 mb-4">
            <h5 className="text-uppercase mb-4 font-weight-bold">Contact Us</h5>
            <div className="mb-3 d-flex align-items-center gap-2">
              <MapPin size={20} />
              <span>Mathbhanga, Coochbehar, West Bengal</span>
            </div>
            <div className="mb-3 d-flex align-items-center gap-2">
              <Phone size={20} />
              <span>+91 865336744</span>
            </div>
            <div className="mb-3 d-flex align-items-center gap-2">
              <Mail size={20} />
              <span>help@petpal.com</span>
            </div>
          </div>
        </div>

        {/* Newsletter */}
        <div className="row mt-4">
          <div className="col-12">
            <div className="bg-secondary bg-opacity-25 p-4 rounded">
              <div className="row align-items-center">
                <div className="col-md-6">
                  <h5 className="mb-md-0">Subscribe to our Newsletter</h5>
                </div>
                <div className="col-md-6">
                  <div className="input-group">
                    <input
                      type="email"
                      className="form-control"
                      value={email}
                      placeholder="Enter your email"
                      onChange={(e) => setEmail(e.target.value)}
                      aria-label="Email subscription input"
                    />
                    <button
                      className="btn btn-primary"
                      onClick={handleSubscibeBtn}
                    >
                      Subscribe
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="row mt-4">
          <div className="col-12">
            <hr className="bg-secondary" />
            <div className="text-center">
              <p className="mb-0">
                © {getCurrentYear()} PetPal. All rights reserved. || Design by
                Kartik Barman
              </p>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
