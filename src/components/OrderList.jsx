import OrderItem from '../components/OrderItem';
import './OrderList.css';

const orders = [
  {
    id: 'SO26009',
    date: 'July 9, 2024',
    amount: '547.00',
    currency: 'CAD',
    description: 'BP Cuffs, Thermometer Probe, SpO2 Sensor',
    status: 'Pending'
  },
  {
    id: 'SO23205',
    date: 'July 6, 2024',
    amount: '42.27',
    currency: 'CAD',
    description: 'Suction Cannister',
    status: 'Shipped'
  },
  {
    id: 'SO43565',
    date: 'July 3, 2024',
    amount: '200.27',
    currency: 'CAD',
    description: 'Patient Sling, Oximeter',
    status: 'Shipped'
  }
];

const OrderList = () => {
  return (
    <div className="order-list">
      {orders.map(order => (
        <OrderItem key={order.id} order={order} />
      ))}
    </div>
  );
};

export default OrderList;
