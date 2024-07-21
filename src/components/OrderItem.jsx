// import React from "react";
import PropTypes from "prop-types";
import "./OrderItem.css";

const OrderItem = ({ order }) => {
  return (
    <tr>
      <td>{order.id}</td>
      <td>{order.date}</td>
      <td>{order.description}</td>
      <td>{order.items}</td>
      <td>CAD {order.amount.toFixed(2)}</td>
      <td className={`status ${order.status.toLowerCase()}`}>{order.status}</td>
    </tr>
  );
};

OrderItem.propTypes = {
  order: PropTypes.shape({
    id: PropTypes.string.isRequired,
    date: PropTypes.string.isRequired,
    amount: PropTypes.number.isRequired,
    status: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
    items: PropTypes.string.isRequired,
  }).isRequired,
};

export default OrderItem;
