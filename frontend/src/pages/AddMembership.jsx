import React, { useState } from "react";
import axios from "axios";
import "../style.css";

function AddMembership() {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    age: "",
    duration: "6months",   // ✅ Default selected
    amount: ""
  });

  const [errors, setErrors] = useState({});
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const token = localStorage.getItem("token");

  // 🔹 Handle Input Change
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  // 🔹 Validation
  const validate = () => {
    let newErrors = {};

    if (!formData.fullName.trim()) {
      newErrors.fullName = "Full Name is required";
    }

    if (!formData.email) {
      newErrors.email = "Email is required";
    } else if (!/^\S+@\S+\.\S+$/.test(formData.email)) {
      newErrors.email = "Invalid email format";
    }

    if (!formData.phone) {
      newErrors.phone = "Phone number is required";
    } else if (!/^[0-9]{10}$/.test(formData.phone)) {
      newErrors.phone = "Phone must be exactly 10 digits";
    }

    if (!formData.age) {
      newErrors.age = "Age is required";
    } else if (parseInt(formData.age) < 18) {
      newErrors.age = "Minimum age is 18";
    }

    if (!formData.duration) {
      newErrors.duration = "Select membership duration";
    }

    if (!formData.amount) {
      newErrors.amount = "Amount is required";
    } else if (parseFloat(formData.amount) <= 0) {
      newErrors.amount = "Amount must be greater than 0";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // 🔹 Submit
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validate()) return;

    try {
      setLoading(true);
      setSuccess("");

      await axios.post(
        "http://localhost:4000/add-membership",
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      setSuccess("Membership Added Successfully ✅");

      setFormData({
        fullName: "",
        email: "",
        phone: "",
        age: "",
        duration: "6months",  // reset default
        amount: ""
      });

      setErrors({});
    } catch (error) {
      setSuccess("");
      setErrors({ api: "Error adding membership" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="form-container">
      <h2>Add Membership</h2>

      {success && <p className="success">{success}</p>}
      {errors.api && <p className="error">{errors.api}</p>}

      <form onSubmit={handleSubmit}>

        <div className="form-group">
          <label>Full Name</label>
          <input
            type="text"
            name="fullName"
            value={formData.fullName}
            onChange={handleChange}
          />
          {errors.fullName && <span className="error">{errors.fullName}</span>}
        </div>

        <div className="form-group">
          <label>Email</label>
          <input
            type="text"
            name="email"
            value={formData.email}
            onChange={handleChange}
          />
          {errors.email && <span className="error">{errors.email}</span>}
        </div>

        <div className="form-group">
          <label>Phone</label>
          <input
            type="text"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
          />
          {errors.phone && <span className="error">{errors.phone}</span>}
        </div>

        <div className="form-group">
          <label>Age</label>
          <input
            type="number"
            name="age"
            value={formData.age}
            onChange={handleChange}
          />
          {errors.age && <span className="error">{errors.age}</span>}
        </div>

        {/* ✅ Duration Radio Buttons */}
        <div className="form-group">
          <label>Membership Duration</label>

          <div className="radio-group">
            <label>
              <input
                type="radio"
                name="duration"
                value="6months"
                checked={formData.duration === "6months"}
                onChange={handleChange}
              />
              6 Months
            </label>

            <label>
              <input
                type="radio"
                name="duration"
                value="1year"
                checked={formData.duration === "1year"}
                onChange={handleChange}
              />
              1 Year
            </label>

            <label>
              <input
                type="radio"
                name="duration"
                value="2years"
                checked={formData.duration === "2years"}
                onChange={handleChange}
              />
              2 Years
            </label>
          </div>

          {errors.duration && (
            <span className="error">{errors.duration}</span>
          )}
        </div>

        <div className="form-group">
          <label>Amount</label>
          <input
            type="number"
            name="amount"
            value={formData.amount}
            onChange={handleChange}
          />
          {errors.amount && <span className="error">{errors.amount}</span>}
        </div>

        <button type="submit" className="btn-primary" disabled={loading}>
          {loading ? "Adding..." : "Add Membership"}
        </button>
      </form>
    </div>
  );
}

export default AddMembership;
