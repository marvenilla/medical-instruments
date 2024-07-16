// import React from "react";
import PropTypes from "prop-types";
import OrderItem from "./OrderItem";
import "./OrderList.css";
import "bootstrap/dist/css/bootstrap.min.css";

const OrderList = ({ orders }) => {
  return (
    <div className="container mt-4">
      <h2 className="mb-4">SALES ORDER</h2>

      <div className="row mb-3">
        <div className="col-md-6">
          <label htmlFor="orderHistory" className="form-label">
            Order History
          </label>
          <select id="orderHistory" className="form-select">
            <option>30 days of order history</option>
            <option>60 days of order history</option>
            <option>90 days of order history</option>
          </select>
        </div>
        <div className="col-md-6">
          <label htmlFor="sortBy" className="form-label">
            Sort By
          </label>
          <select id="sortBy" className="form-select">
            <option>Order Date (Newest)</option>
            <option>Order Date (Oldest)</option>
            <option>Amount (High to Low)</option>
            <option>Amount (Low to High)</option>
          </select>
        </div>
      </div>

      <div className="row mb-3 align-items-center">
        <div className="col-md-6 d-flex">
          <input
            type="text"
            className="form-control me-2"
            placeholder="Find by order number"
          />
          <button className="btn btn-primary" type="button">
            <i className="fas fa-search"></i> Find
          </button>
        </div>
        <div className="col-md-6 d-flex flex-wrap justify-content-end">
          <button type="button" className="btn btn-outline-secondary me-2 mb-2">
            Work Orders (3)
          </button>
          <button type="button" className="btn btn-outline-secondary me-2 mb-2">
            Purchasing (2)
          </button>
          <button type="button" className="btn btn-outline-secondary me-2 mb-2">
            Incoming (3)
          </button>
          <button type="button" className="btn btn-outline-secondary me-2 mb-2">
            Quality (2)
          </button>
          <button type="button" className="btn btn-outline-secondary me-2 mb-2">
            Kitting (3)
          </button>
          <button type="button" className="btn btn-outline-secondary mb-2">
            Production (5)
          </button>
        </div>
      </div>

      <table className="table table-bordered">
        <thead className="table-light">
          <tr>
            <th scope="col">Order #</th>
            <th scope="col">Order Date</th>
            <th scope="col">Order Details</th>
            <th scope="col">Ship To</th>
            <th scope="col">Product Total</th>
            <th scope="col">Status</th>
          </tr>
        </thead>
        <tbody>
          {orders.map((order) => (
            <OrderItem key={order.id} order={order} />
          ))}
        </tbody>
      </table>
    </div>
  );
};

OrderList.propTypes = {
  orders: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      date: PropTypes.string.isRequired,
      amount: PropTypes.number.isRequired,
      status: PropTypes.string.isRequired,
      description: PropTypes.string.isRequired,
      shipTo: PropTypes.string.isRequired,
    })
  ).isRequired,
};

export default OrderList;
