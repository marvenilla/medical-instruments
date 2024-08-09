import PropTypes from "prop-types";
import "./OrderItem.css";
import { Link } from "react-router-dom";

const OrderItem = ({ order, onDelete }) => {
  return (
    <tr>
      <td><Link to={`/sales-order-details/${order.id}`}>{order.id}</Link></td>
      <td>{order.date}</td>
      <td>{order.client}</td>
      <td>{order.ordered_products}</td>
      <td>CAD {order.amount ? order.amount.toFixed(2) : "0.00"}</td>
      <td className={`status ${order.status?.toLowerCase()}`}>{order.status}</td>
      <td>{order.shipmentStatus}</td>
      <td>{order.shipmentDate}</td>
      <td>
        <button className="sales-delete-button" onClick={() => onDelete(order.id)}>
          Delete
        </button>
      </td>
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
    client: PropTypes.string.isRequired,
    ordered_products: PropTypes.string,
    shipmentStatus: PropTypes.string.isRequired,
    shipmentDate: PropTypes.string.isRequired,
  }).isRequired,
  onDelete: PropTypes.func.isRequired,
};

export default OrderItem;
