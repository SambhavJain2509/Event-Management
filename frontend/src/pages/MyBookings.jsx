//---------------------------------------------- user only -------------------------------------
import React, { useEffect, useState } from "react";
import axios from "axios";
import "../style.css";

function MyBookings() {
  const [bookings, setBookings] = useState([]);

  const token = localStorage.getItem("token");

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      const res = await axios.get("http://localhost:4000/my-bookings", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setBookings(res.data);
    } catch (error) {
      console.error(error);
    }
  };

  const cancelBooking = async (id) => {
    try {
      await axios.put(
        `http://localhost:4000/cancel-booking/${id}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      alert("Booking cancelled");

      fetchBookings();
    } catch (error) {
      alert("Cancel failed");
    }
  };

  return (
    <div className="container">
      <h2>My Bookings</h2>

      {bookings.map((booking) => (
        <div key={booking.booking_id} className="booking-card">
          <h3>{booking.service_name}</h3>

          <p>
            <b>Vendor:</b> {booking.vendor_name}
          </p>
          <p>
            <b>Category:</b> {booking.category}
          </p>
          <p>
            <b>Date:</b> {booking.event_date}
          </p>
          <p>
            <b>Amount:</b> ₹{booking.total_amount}
          </p>
          <p>
            <b>Status:</b>
            <span className={`status ${booking.booking_status}`}>
              {booking.booking_status}
            </span>
          </p>
          {booking.booking_status !== "Cancelled" && (
            <button onClick={() => cancelBooking(booking.booking_id)}>
              Cancel Booking
            </button>
          )}
        </div>
      ))}
    </div>
  );
}

export default MyBookings;
