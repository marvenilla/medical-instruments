// import './OrderItem.css';
// import PropTypes from 'prop-types';

// const OrderItem = ({ order }) => {
//   return (
//     <div className="order-item">
//       <div className="order-item-content">
//         <div>Date requested {order.date}</div>
//         <div>Amount: {order.currency} {order.amount}</div>
//         <div>
//           <strong>{order.id}</strong> - {order.description}
//         </div>
//       </div>
//       <span className={`order-status ${order.status.toLowerCase()}`}>
//         {order.status}
//       </span>
//     </div>
//   );
// };

// OrderItem.propTypes = {
//   order: PropTypes.shape({
//     id: PropTypes.string.isRequired,
//     date: PropTypes.string.isRequired,
//     amount: PropTypes.string.isRequired,
//     currency: PropTypes.string.isRequired,
//     description: PropTypes.string.isRequired,
//     purchaseOrder: PropTypes.string.isRequired,
//     status: PropTypes.string.isRequired,
//   }).isRequired,
// };

// export default OrderItem;

import './OrderItem.css';
import PropTypes from 'prop-types';

const OrderItem = ({ order }) => {
  return (
    <div className="order-item">
      <div className="order-item-header">
        <div className="order-date">
          Date requested:{' '}
          {order.date.toLocaleDateString('en-US', {
            timeZone: 'UTC',
            month: 'long',
            day: '2-digit',
            year: 'numeric',
          })}
        </div>
        <div className="order-amount">
          Amount: {order.currency} {order.amount}
        </div>
        <div className="order-operation">Operation: {order.operation}</div>
        <span className={`order-status ${order.status.toLowerCase()}`}>
          {order.status}
        </span>
      </div>
      <hr />
      <div className="order-item-content">
        <div className="order-id">
          <strong>{order.id}</strong>
        </div>
        <div className="order-description">{order.description}</div>
      </div>
    </div>
  );
};

OrderItem.propTypes = {
  order: PropTypes.shape({
    id: PropTypes.string.isRequired,
    date: PropTypes.string.isRequired,
    amount: PropTypes.string.isRequired,
    currency: PropTypes.string.isRequired,
    operation: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
    purchaseOrder: PropTypes.string.isRequired,
    status: PropTypes.string.isRequired,
  }).isRequired,
};

export default OrderItem;

