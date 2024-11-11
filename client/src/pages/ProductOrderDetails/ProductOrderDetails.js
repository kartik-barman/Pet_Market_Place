import axios from "axios";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import styles from "./ProductOrderDetails.module.css";

const ProductOrderDetails = () => {
  const token = localStorage.getItem("token");
  const { productId } = useParams();
  const [orders, setOrders] = useState([]);
  const [error, setError] = useState(null);

  const fetchAllOrder = async () => {
    try {
      const res = await axios.get(
        `http://localhost:5000/api/pets/pet/orders/${productId}`
      );
      setOrders(res.data);
      console.log(res.data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchAllOrder();
  }, []);

  const getStatusBadge = (status) => {
    switch (status) {
      case "Delivered":
        return "badge bg-success";
      case "Pending":
        return "badge bg-warning text-dark";
      case "Cancelled":
        return "badge bg-danger";
      case "Shipped":
        return "badge bg-info";
      case "Out For Delivery":
        return "badge bg-primary";
      default:
        return "badge bg-secondary";
    }
  };

  const updateStatus = async (orderId, newStatus) => {
    try {
      const res = await axios.put(
        `http://localhost:5000/api/orders/${orderId}/status`,
        { orderStatus: newStatus },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setOrders((prevOrders) =>
        prevOrders.map((order) =>
          order._id === orderId ? { ...order, orderStatus: newStatus } : order
        )
      );
      console.log("Order status updated:", res.data);
    } catch (error) {
      setError("Error updating order status");
      console.error(error);
    }
  };

  return (
    <div className="container mt-5" style={{ height: "100vh" }}>
      <h2 className="text-center">Orders List</h2>
      {error && <p className="text-danger" >{error}</p>}
      {orders.length === 0 ? (
        <p className={`${styles.notAvailable} badge bg-danger fs-5`}>No Order Available for this Product</p>
      ) : (
        <table className="table table-striped table-responsive">
          <thead>
            <tr>
              <th>User Name</th>
              <th>Email</th>
              <th>Shipping Address</th>
              <th>Order Status</th>
              <th>Total Amount</th>
              <th>Order Date</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order, index) => (
              <tr key={index}>
                <td>{order.user.name}</td>
                <td>{order.user.email}</td>
                <td>{`${order.shippingAddress.address}, ${order.shippingAddress.city}, ${order.shippingAddress.dist}, ${order.shippingAddress.zip}, ${order.shippingAddress.country}`}</td>
                <td>
                  <span className={`${getStatusBadge(order.orderStatus)} me-2`}>
                    {order.orderStatus}
                  </span>
                  <select
                    value={order.orderStatus}
                    onChange={(e) => updateStatus(order._id, e.target.value)}
                  >
                    <option value="">----Select----</option>
                    <option value="Pending">Pending</option>
                    <option value="Cancelled">Cancelled</option>
                    <option value="Shipped">Shipped</option>
                    <option value="Out For Delivery">Out For Delivery</option>
                    <option value="Delivered">Delivered</option>
                  </select>
                </td>
                <td>{order.totalAmount}</td>
                <td>{new Date(order.createdAt).toLocaleDateString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default ProductOrderDetails;
