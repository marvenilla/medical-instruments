/* eslint-disable react/prop-types */
import PropTypes from "prop-types";
import "./OrderItem.css";
import { Link } from "react-router-dom";

const OrderItem = ({ order }) => {
  return (
    <tr>
      <td><Link to={`/sales-order-details/${order.id}`}>{order.id}</Link></td>
      <td>{order.date}</td>
      <td>{order.client}</td>
      <td>{order.description}</td>
      <td>CAD {order.amount?.toFixed(2)}</td>
      <td className={`status ${order.status?.toLowerCase()}`}>{order.status}</td>
      <td>{order.shipmentStatus}</td>
      <td>{order.shipmentDate}</td>
    </tr>
  );
};

OrderItem.propTypes = {
  order: PropTypes.shape({
    id: PropTypes.number.isRequired,
    date: PropTypes.string.isRequired,
    amount: PropTypes.number.isRequired,
    status: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
    items: PropTypes.string.isRequired,
  }).isRequired,
};

export default OrderItem;
