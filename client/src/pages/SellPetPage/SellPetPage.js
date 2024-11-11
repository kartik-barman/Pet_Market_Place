import React, { useState } from "react";
import axios from "axios";
import { FaTrash, FaPlusCircle } from "react-icons/fa";
import toast, { Toaster } from "react-hot-toast"; // Import react-hot-toast
import styles from "./SellPetPage.module.css";

const SellPetPage = () => {
  const token = localStorage.getItem("token");
  const [formData, setFormData] = useState({
    name: "",
    location: "",
    category: "",
    breed: "",
    age: "",
    price: "",
    description: "",
    seller: "",
    rating: "",
    isAvailable: true,
  });

  const [imageFiles, setImageFiles] = useState([null]);

  const [errors, setErrors] = useState(null);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleImageChange = (index, e) => {
    const files = [...imageFiles];
    files[index] = e.target.files[0]; // Update the file for the corresponding index
    setImageFiles(files);
  };

  const addImageField = () => {
    if (imageFiles.length < 5) {
      // Allow adding images only if there are fewer than 5 images
      setImageFiles([...imageFiles, null]); // Add an empty slot for a new file
    }
  };

  const removeImageField = (index) => {
    const files = [...imageFiles];
    files.splice(index, 1); // Remove the selected file at the specified index
    setImageFiles(files);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formDataToSend = new FormData();

    // Append form data fields
    for (const key in formData) {
      formDataToSend.append(key, formData[key]);
    }

    // Append image files
    imageFiles.forEach((file, index) => {
      if (file) {
        formDataToSend.append("images", file);
      }
    });
    // for (let pair of formDataToSend.entries()) {
    //   console.log(pair[0] + ": " + pair[1]);
    // }
    try {
      const res = await axios.post(
        "https://pet-market-place-server.onrender.com/api/pets/create",
        formDataToSend,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log(res.data);
      // Clear form after successful submission
      setFormData({
        name: "",
        location: "",
        category: "",
        breed: "",
        age: "",
        price: "",
        description: "",
        seller: "",
        rating: "",
        isAvailable: true,
      });
      setImageFiles([null]);
      toast.success("Pet added successfully!"); // Success toast
    } catch (error) {
      console.error(error);
      setErrors("Failed to add pet. Please check the form data.");
      toast.error("Failed to add pet. Please check the form data."); // Error toast
    }
  };

  return (
    <div className={`container my-5 ${styles.formContainer}`}>
      <Toaster />
      <h2 className="text-center mb-4">Add a New Pet</h2>
      <form
        onSubmit={handleSubmit}
        encType="multipart/form-data"
        className="row g-3"
      >
        <div className="col-md-6">
          <label className="form-label">Name:</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            required
            className={`form-control ${styles.inputField}`}
          />
        </div>

        <div className="col-md-6">
          <label className="form-label">Location:</label>
          <input
            type="text"
            name="location"
            value={formData.location}
            onChange={handleInputChange}
            className={`form-control ${styles.inputField}`}
          />
        </div>

        <div className="col-md-6">
          <label className="form-label">Category:</label>
          <input
            type="text"
            name="category"
            value={formData.category}
            onChange={handleInputChange}
            required
            className={`form-control ${styles.inputField}`}
          />
        </div>

        <div className="col-md-6">
          <label className="form-label">Breed:</label>
          <input
            type="text"
            name="breed"
            value={formData.breed}
            onChange={handleInputChange}
            className={`form-control ${styles.inputField}`}
          />
        </div>

        <div className="col-md-6">
          <label className="form-label">Age:</label>
          <input
            type="text"
            name="age"
            value={formData.age}
            onChange={handleInputChange}
            className={`form-control ${styles.inputField}`}
          />
        </div>

        <div className="col-md-6">
          <label className="form-label">Price:</label>
          <input
            type="number"
            name="price"
            value={formData.price}
            onChange={handleInputChange}
            required
            className={`form-control ${styles.inputField}`}
          />
        </div>

        <div className="col-12">
          <label className="form-label">Description:</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleInputChange}
            className={`form-control ${styles.inputField}`}
            rows="3"
          ></textarea>
        </div>

        <div className="col-12">
          <label className="form-label">Images:</label>
          {imageFiles.map((image, index) => (
            <div key={index} className="d-flex align-items-center mb-2">
              <input
                type="file"
                onChange={(e) => handleImageChange(index, e)}
                className="form-control me-2"
              />
              {index > 0 && (
                <button
                  type="button"
                  onClick={() => removeImageField(index)}
                  className="btn btn-danger"
                >
                  <FaTrash />
                </button>
              )}
            </div>
          ))}
          <button
            type="button"
            onClick={addImageField}
            className="btn btn-success mt-2"
            disabled={imageFiles.length === 5}
          >
            <FaPlusCircle className="me-2" /> Add More Images
          </button>
        </div>

        <div className="col-md-12">
          <label className="form-label">Rating:</label>
          <input
            type="number"
            name="rating"
            value={formData.rating}
            onChange={handleInputChange}
            className={`form-control ${styles.inputField}`}
            min="0"
            max="5"
          />
        </div>

        <div className="col-md-6">
          <label className="form-label">Is Available:</label>
          <div className="form-check">
            <input
              type="checkbox"
              name="isAvailable"
              checked={formData.isAvailable}
              onChange={(e) =>
                setFormData({ ...formData, isAvailable: e.target.checked })
              }
              className="form-check-input"
            />
            <label className="form-check-label">Available</label>
          </div>
        </div>

        <div className="col-12 text-center">
          <button
            type="submit"
            className={`btn btn-primary ${styles.submitButton}`}
          >
            Submit
          </button>
        </div>
        {errors && <p className="text-danger mt-2 text-center">{errors}</p>}
      </form>
    </div>
  );
};

export default SellPetPage;
