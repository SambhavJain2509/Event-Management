import React, { useEffect, useState } from "react";
import axios from "axios";
import "../style.css";

function MyServices() {
  const token = localStorage.getItem("token");

  const [services, setServices] = useState([]);
  const [editId, setEditId] = useState(null);
  const [editData, setEditData] = useState({
    service_name: "",
    category: "",
    description: "",
    price: "",
  });

  const fetchServices = async () => {
    try {
      const res = await axios.get(
        "http://localhost:4000/vendor/my-services",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setServices(res.data);
    } catch (error) {
      console.error("Error fetching services");
    }
  };

  useEffect(() => {
    fetchServices();
  }, []);

  // DELETE SERVICE
  const handleDelete = async (id) => {
    try {
      await axios.delete(
        `http://localhost:4000/vendor/delete-service/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      fetchServices();
    } catch (error) {
      console.error("Error deleting service");
    }
  };

  // START EDIT
  const handleEdit = (service) => {
    setEditId(service.id);
    setEditData(service);
  };

  // HANDLE EDIT CHANGE
  const handleEditChange = (e) => {
    setEditData({
      ...editData,
      [e.target.name]: e.target.value,
    });
  };

  // UPDATE SERVICE
  const handleUpdate = async (id) => {
    try {
      await axios.put(
        `http://localhost:4000/vendor/update-service/${id}`,
        editData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setEditId(null);
      fetchServices();
    } catch (error) {
      console.error("Error updating service");
    }
  };

  return (
    <div className="table-container">
      <h2>My Services</h2>

      {services.length === 0 ? (
        <p>No services added yet.</p>
      ) : (
        <table className="vendor-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Category</th>
              <th>Description</th>
              <th>Price</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>
            {services.map((service) => (
              <tr key={service.id}>
                <td>
                  {editId === service.id ? (
                    <input
                      name="service_name"
                      value={editData.service_name}
                      onChange={handleEditChange}
                    />
                  ) : (
                    service.service_name
                  )}
                </td>

                <td>
                  {editId === service.id ? (
                    <input
                      name="category"
                      value={editData.category}
                      onChange={handleEditChange}
                    />
                  ) : (
                    service.category
                  )}
                </td>

                <td>
                  {editId === service.id ? (
                    <input
                      name="description"
                      value={editData.description}
                      onChange={handleEditChange}
                    />
                  ) : (
                    service.description
                  )}
                </td>

                <td>
                  {editId === service.id ? (
                    <input
                      name="price"
                      type="number"
                      value={editData.price}
                      onChange={handleEditChange}
                    />
                  ) : (
                    `₹ ${service.price}`
                  )}
                </td>

                <td>
                  {editId === service.id ? (
                    <>
                      <button
                        onClick={() => handleUpdate(service.id)}
                        className="update-btn"
                      >
                        Save
                      </button>
                      <button
                        onClick={() => setEditId(null)}
                        className="cancel-btn"
                      >
                        Cancel
                      </button>
                    </>
                  ) : (
                    <>
                      <button
                        onClick={() => handleEdit(service)}
                        className="edit-btn"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(service.id)}
                        className="delete-btn"
                      >
                        Delete
                      </button>
                    </>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default MyServices;