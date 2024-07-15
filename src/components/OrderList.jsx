// import OrderItem from '../components/OrderItem';
// import './OrderList.css';

// const orders = [
//   {
//     id: 'SO26009',
//     date: 'July 9, 2024',
//     amount: '547.00',
//     currency: 'CAD',
//     description: 'BP Cuffs, Thermometer Probe, SpO2 Sensor',
//     status: 'Pending'
//   },
//   {
//     id: 'SO23205',
//     date: 'July 6, 2024',
//     amount: '42.27',
//     currency: 'CAD',
//     description: 'Suction Cannister',
//     status: 'Shipped'
//   },
//   {
//     id: 'SO43565',
//     date: 'July 3, 2024',
//     amount: '200.27',
//     currency: 'CAD',
//     description: 'Patient Sling, Oximeter',
//     status: 'Shipped'
//   }
// ];

// const OrderList = () => {
//   return (
//     <div className="order-list">
//       {orders.map(order => (
//         <OrderItem key={order.id} order={order} />
//       ))}
//     </div>
//   );
// };

// export default OrderList;

import { useState } from 'react';
import OrderItem from '../components/OrderItem';
import './OrderList.css';
import { isSameDate } from '../helpers/dates';

const orders = [
  {
    id: 'SO26009',
    date: new Date('2024-07-09'),
    amount: '547.00',
    currency: 'CAD',
    operation: 'Work Order',
    description: 'BP Cuffs, Thermometer Probe, SpO2 Sensor',
    status: 'Pending',
  },
  {
    id: 'SO23205',
    date: new Date('2024-07-06'),
    amount: '42.27',
    currency: 'CAD',
    operation: 'Shipped',
    description: 'Suction Cannister',
    status: 'Shipped',
  },
  {
    id: 'SO43565',
    date: new Date('2024-07-03'),
    amount: '200.27',
    currency: 'CAD',
    operation: 'Shipped',
    description: 'Patient Sling, Oximeter',
    status: 'Shipped',
  },
];

const OrderList = () => {
  const [selectedStatus, setSelectedStatus] = useState('All');
  const [selectedId, setSelectedId] = useState('');
  const [selectedDate, setSelectedDate] = useState('');

  const handleStatusChange = (event) => {
    setSelectedStatus(event.target.value);
  };
  const handleIdChange = (event) => {
    setSelectedId(event.target.value);
  };
  const handleDateChange = (event) => {
    setSelectedDate(event.target.value);
  };

  const filteredOrders = orders.filter((order) => {
    const matchesStatus =
      selectedStatus === 'All' || order.status === selectedStatus;
    const matchesId =
      selectedId === '' || order.id.includes(selectedId.toUpperCase());
    const matchesDate =
      selectedDate === '' || isSameDate(order.date, new Date(selectedDate));
    return matchesStatus && matchesId && matchesDate;
  });
  return (
    <>
      <div className="order-filters">
        <div className="field-filter">
          <label className="form-label">ID:</label>
          <input
            type="text"
            className="form-control form-control-lg"
            value={selectedId}
            onChange={handleIdChange}
            placeholder="Filter by ID"
          />
        </div>

        <div className="field-filter">
          <label className="form-label">Status:</label>
          <select
            className="form-select form-select-lg"
            value={selectedStatus}
            onChange={handleStatusChange}
          >
            <option value="All">All</option>
            <option value="Shipped">Shipped</option>
            <option value="Pending">Pending</option>
          </select>
        </div>

        <div className="field-filter">
          <label className="form-label">Date:</label>
          <input
            type="date"
            className="form-control form-control-lg"
            value={selectedDate}
            onChange={handleDateChange}
          />
        </div>
      </div>
      <div className="order-list">
        {filteredOrders.map((order) => (
          <OrderItem key={order.id} order={order} />
        ))}
      </div>
    </>
  );
};

export default OrderList;