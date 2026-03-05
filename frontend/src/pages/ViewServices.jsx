// ------------------------------------ user only --------------------------------------------------
import React, { useEffect, useState } from "react";
import axios from "axios";
import "../style.css";

function ViewServices() {

  const [services, setServices] = useState([]);
  const [eventDate, setEventDate] = useState("");
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("");

  const token = localStorage.getItem("token");

  useEffect(() => {
    fetchServices();
  }, []);

  const fetchServices = async () => {
    try {

      const res = await axios.get("http://localhost:4000/services", {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      setServices(res.data);

    } catch (error) {
      console.error(error);
    }
  };

  const bookService = async (serviceId) => {

    if (!eventDate) {
      setMessage("Please select an event date first.");
      setMessageType("error");
      return;
    }

    try {

      const res = await axios.post(
        "http://localhost:4000/book-service",
        {
          service_id: serviceId,
          event_date: eventDate
        },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      setMessage(res.data.message);
      setMessageType("success");

      setTimeout(() => {
        setMessage("");
      }, 4000);

    } catch (error) {

      setMessage("Booking failed. Please try again.");
      setMessageType("error");

      setTimeout(() => {
        setMessage("");
      }, 4000);
    }
  };

  return (
    <div className="container">

      <h2>Available Vendor Services</h2>

      {/* Notification Message */}
      {message && (
        <div className={`notification ${messageType}`}>
          {message}
        </div>
      )}

      <input
        type="date"
        onChange={(e) => setEventDate(e.target.value)}
      />

      <div className="service-grid">

      {services.map((service) => (

        <div key={service.service_id} className="service-card">

          <h3>{service.service_name}</h3>
          <p><b>Category:</b> {service.category}</p>
          <p>{service.description}</p>
          <p><b>Vendor:</b> {service.vendor_name}</p>
          <p><b>Phone:</b> {service.vendor_phone}</p>
          <p><b>Price:</b> ₹{service.price}</p>

          <button onClick={() => bookService(service.service_id)}>
            Book Service
          </button>

        </div>

      ))}

      </div>

    </div>
  );
}

export default ViewServices;