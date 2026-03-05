//---------------------------------------------- admin only -------------------------------------
import React, { useState } from "react";
import axios from "axios";
import "../style.css";

function UpdateMembership() {
  const [membershipNumber, setMembershipNumber] = useState("");
  const [membershipData, setMembershipData] = useState(null);
  const [action, setAction] = useState("extend");
  const [confirmCancel, setConfirmCancel] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [message, setMessage] = useState("");

  const token = localStorage.getItem("token");

  //  Validate Membership Number
  const validateSearch = () => {
    let tempErrors = {};

    if (!membershipNumber.trim()) {
      tempErrors.membershipNumber = "Membership number is required.";
    } else if (!/^MEM[0-9]+$/.test(membershipNumber)) {
      tempErrors.membershipNumber =
        "Membership number must start with MEM followed by numbers.";
    }
    

    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };

  //  Fetch Membership
  const fetchMembership = async () => {
    if (!validateSearch()) return;

    try {
      setLoading(true);
      setMessage("");
      setMembershipData(null);

      const res = await axios.get(
        `http://localhost:4000/membership/${membershipNumber}`,
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );

      setMembershipData(res.data);
      setErrors({});
    } catch (err) {
      setMessage("Membership not found.");
    } finally {
      setLoading(false);
    }
  };

  //  Validate Update
  const validateUpdate = () => {
    let tempErrors = {};

    if (!action) {
      tempErrors.action = "Please select an action.";
    }

    if (action === "cancel" && !confirmCancel) {
      tempErrors.confirmCancel =
        "You must confirm cancellation.";
    }

    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };

  //  Handle Update
  const handleUpdate = async () => {
    if (!validateUpdate()) return;

    try {
      setLoading(true);
      setMessage("");

      await axios.put(
        "http://localhost:4000/update-membership",
        {
          membership_number: membershipNumber,
          action: action
        },
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );

      setMessage("Membership updated successfully ✅");

      setMembershipData(null);
      setMembershipNumber("");
      setAction("extend");
      setConfirmCancel(false);
      setErrors({});
    } catch (err) {
      setMessage("Error updating membership.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container">
      <h2>Update Membership</h2>

      {message && <div className="message-box">{message}</div>}

      {/* Search Section */}
      <div className="search-section">
        <input
          type="text"
          placeholder="Enter Membership Number"
          value={membershipNumber}
          onChange={(e) => setMembershipNumber(e.target.value)}
          className={errors.membershipNumber ? "input-error" : ""}
        />
        <button onClick={fetchMembership} disabled={loading}>
          {loading ? "Searching..." : "Search"}
        </button>
      </div>

      {errors.membershipNumber && (
        <p className="error-message">{errors.membershipNumber}</p>
      )}

      {/* Member Details */}
      {membershipData && (
        <div className="member-details">
          <h4>Member Details</h4>

          <div className="details-grid">
            <p><b>Name:</b> {membershipData.full_name}</p>
            <p><b>Email:</b> {membershipData.email}</p>
            <p><b>Phone:</b> {membershipData.phone}</p>
            <p><b>Status:</b> {membershipData.status}</p>
            <p><b>End Date:</b> {membershipData.end_date}</p>
          </div>

          <hr />

          <div className="radio-group">
            <label>
              <input
                type="radio"
                value="extend"
                checked={action === "extend"}
                onChange={(e) => setAction(e.target.value)}
              />
              Extend 
            </label>

            <label>
              <input
                type="radio"
                value="cancel"
                checked={action === "cancel"}
                onChange={(e) => setAction(e.target.value)}
              />
              Cancel Membership
            </label>
          </div>

          {errors.action && (
            <p className="error-message">{errors.action}</p>
          )}

          {action === "cancel" && (
            <div className="checkbox-group">
              <label>
                <input
                  type="checkbox"
                  checked={confirmCancel}
                  onChange={(e) => setConfirmCancel(e.target.checked)}
                />
                I confirm cancellation
              </label>

              {errors.confirmCancel && (
                <p className="error-message">{errors.confirmCancel}</p>
              )}
            </div>
          )}

          <button
            onClick={handleUpdate}
            className="update-btn"
            disabled={loading}
          >
            {loading ? "Updating..." : "Submit"}
          </button>
        </div>
      )}
    </div>
  );
}

export default UpdateMembership;
