/* eslint-disable react/prop-types */
import PropTypes from "prop-types";
import "./OrderItem.css";
import { Link } from "react-router-dom";

const OrderItem = ({ order }) => (
  <tr>
    {/* <td>{index + 1}</td> */}
    <td><Link to={`/sales-order-details/${order.id}`}>{order.id}</Link></td>
    <td>{order.date}</td>
    <td>{order.client}</td>
    <td>{order.description}</td>
    <td>CAD {order.total_cost ? order.total_cost.toFixed(2) : "0.00"}</td>
    <td className={`status ${order.status?.toLowerCase()}`}>{order.status}</td>
    <td>{order.shipmentStatus}</td>
    <td>{order.shipmentDate}</td>
  </tr>
);

OrderItem.propTypes = {
  order: PropTypes.shape({
    id: PropTypes.number.isRequired,
    date: PropTypes.string.isRequired,
    total_cost: PropTypes.number,
    status: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
    client: PropTypes.string.isRequired,
    shipmentStatus: PropTypes.string.isRequired,
    shipmentDate: PropTypes.string.isRequired,
  }).isRequired,
  index: PropTypes.number.isRequired,
};

export default OrderItem;
