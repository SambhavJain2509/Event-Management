import React, { useState } from "react";
import axios from "axios";
import "../style.css";

function AddService() {
  const token = localStorage.getItem("token");

  const [formData, setFormData] = useState({
    service_name: "",
    category: "",
    description: "",
    price: "",
  });

  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await axios.post(
        "http://localhost:4000/vendor/add-service",
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setMessage(res.data.message);

      setFormData({
        service_name: "",
        category: "",
        description: "",
        price: "",
      });

    } catch (error) {
      setMessage("Error adding service");
    }
  };

  return (
    <div className="form-container">
      <h2>Add Service</h2>

      {message && <p className="success-message">{message}</p>}

      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="service_name"
          placeholder="Service Name"
          value={formData.service_name}
          onChange={handleChange}
          required
        />

        <input
          type="text"
          name="category"
          placeholder="Category"
          value={formData.category}
          onChange={handleChange}
        />

        <textarea
          name="description"
          placeholder="Description"
          value={formData.description}
          onChange={handleChange}
        />

        <input
          type="number"
          name="price"
          placeholder="Price"
          value={formData.price}
          onChange={handleChange}
          required
        />

        <button type="submit">Add Service</button>
      </form>
    </div>
  );
}

export default AddService;