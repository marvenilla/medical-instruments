import { useState, useEffect } from "react";
import PageNav from "../components/PageNav";
import OrderItem from "../components/OrderItem";

const Sales = () => {
  const [orders, setOrders] = useState([]);
  const [orderHistory, setOrderHistory] = useState("30 days");
  const [sortBy, setSortBy] = useState("Order Date (Newest)");
  const [searchText, setSearchText] = useState("");
  const [statusData, setStatusData] = useState([]);

  useEffect(() => {
    const dummyOrders = [
      {
        id: "S10072024",
        date: "2024-07-10",
        amount: 73.12,
        status: "Purchasing",
        description: "Acct #: 493827 Ordered by: Emily Roberts",
        shipTo: "Maple Leaf Medical Center",
      },
      {
        id: "S09072024",
        date: "2024-07-09",
        amount: 425,
        status: "Purchasing",
        description: "Acct #: 561902 Ordered by: Sophia Martinez",
        shipTo: "Lakeside Health Clinic",
      },
      {
        id: "S08072024",
        date: "2024-07-08",
        amount: 580,
        status: "Work Order",
        description: "Acct #: 748320 Ordered by: Ethan Johnson",
        shipTo: "Midtown Wellness Clinic",
      },
      {
        id: "S07072024",
        date: "2024-07-07",
        amount: 1200,
        status: "Kitting",
        description: "Acct #: 215489 Ordered by: Lucas Williams",
        shipTo: "Toronto Family Care Clinic",
      },
      {
        id: "S06072024",
        date: "2024-07-06",
        amount: 2350,
        status: "Quality",
        description: "Acct #: 493827 Ordered by: Emily Roberts",
        shipTo: "Evergreen Health Solutions",
      },
      {
        id: "S05072024",
        date: "2024-07-05",
        amount: 3900,
        status: "Incoming",
        description: "Acct #: 493827 Ordered by: Emily Roberts",
        shipTo: "North York Medical Plaza",
      },
      {
        id: "S04072024",
        date: "2024-07-04",
        amount: 975,
        status: "Work Order",
        description: "Acct #: 561902 Ordered by: Sophia Martinez",
        shipTo: "Harmony Health Hospital",
      },
      {
        id: "S03072024",
        date: "2024-07-03",
        amount: 750,
        status: "Quality",
        description: "Acct #: 561902 Ordered by: Sophia Martinez",
        shipTo: "Bayview Wellness Center",
      },
      {
        id: "S02072024",
        date: "2024-07-02",
        amount: 4500,
        status: "Kitting",
        description: "Acct #: 493827 Ordered by: Emily Roberts",
        shipTo: "Urban Health Centre",
      },
      {
        id: "S01072024",
        date: "2024-07-01",
        amount: 5250,
        status: "Incoming",
        description: "Acct #: 215489 Ordered by: Lucas Williams",
        shipTo: "Downtown Medical Centre",
      },
      {
        id: "S30062024",
        date: "2024-06-30",
        amount: 3100,
        status: "Production",
        description: "Acct #: 493827 Ordered by: Emily Roberts",
        shipTo: "Parkdale Hospital",
      },
      {
        id: "S29062024",
        date: "2024-06-29",
        amount: 5950,
        status: "Production",
        description: "Acct #: 493827 Ordered by: Emily Roberts",
        shipTo: "Forest Hill Medical Group",
      },
      {
        id: "S28062024",
        date: "2024-06-28",
        amount: 600,
        status: "Production",
        description: "Acct #: 748320 Ordered by: Ethan Johnson",
        shipTo: "Liberty Village Health Centre",
      },
      {
        id: "S27062024",
        date: "2024-06-27",
        amount: 1850,
        status: "Incoming",
        description: "Acct #: 215489 Ordered by: Lucas Williams",
        shipTo: "West End Medical Clinic",
      },
      {
        id: "S26062024",
        date: "2024-06-26",
        amount: 2750,
        status: "Production",
        description: "Acct #: 561902 Ordered by: Sophia Martinez",
        shipTo: "Riverdale Health and Wellness Clinic",
      },
      {
        id: "S25062024",
        date: "2024-06-25",
        amount: 4800,
        status: "Work Order",
        description: "Acct #: 748320 Ordered by: Ethan Johnson",
        shipTo: "Diamond Labs",
      },
      {
        id: "S24062024",
        date: "2024-06-24",
        amount: 193.12,
        status: "Kitting",
        description: "Acct #: 561902 Ordered by: Sophia Martinez",
        shipTo: "Toronto Clinic",
      },
      {
        id: "S23062024",
        date: "2024-06-23",
        amount: 473.11,
        status: "Production",
        description: "Acct #: 215489 Ordered by: Lucas Williams",
        shipTo: "St. Andrew's Hospital",
      },
    ];
    setOrders(dummyOrders);
  }, []);

  const handleOrderHistoryChange = (e) => setOrderHistory(e.target.value);
  const handleSortByChange = (e) => setSortBy(e.target.value);
  const handleSearchTextChange = (e) => setSearchText(e.target.value);

  const filterByStatus = (status) => {
    if (status === "All") {
      setOrders(orders);
      setStatusData(orders)
    } else {
      const filtered = orders.filter((order) => order.status === status);
      setStatusData(filtered);
    }
  };

  const statusCounts = orders.reduce((acc, order) => {
    acc[order.status] = (acc[order.status] || 0) + 1;
    return acc;
  }, {});
  
  const filterOrders = () => {
    let filteredOrders = orders;

    // Filter by order history
    const now = new Date();
    let daysAgo;
    switch (orderHistory) {
      case "30 days":
        daysAgo = 30;
        break;
      case "60 days":
        daysAgo = 60;
        break;
      case "90 days":
        daysAgo = 90;
        break;
      default:
        daysAgo = 30;
    }
    const cutoffDate = new Date(now.setDate(now.getDate() - daysAgo));
    filteredOrders = filteredOrders.filter((order) => new Date(order.date) >= cutoffDate);

    //Filter by status selection
    if(statusData.length > 0){
      filteredOrders = statusData;
    }
    // Filter by search text
    if (searchText) {
      // setStatusData([])
      filteredOrders = filteredOrders.filter((order) =>
        order.id.toLowerCase().includes(searchText.toLowerCase())
      );
    }

    // Sort by criteria
    switch (sortBy) {
      case "Order Date (Newest)":
        filteredOrders.sort((a, b) => new Date(b.date) - new Date(a.date));
        break;
      case "Order Date (Oldest)":
        filteredOrders.sort((a, b) => new Date(a.date) - new Date(b.date));
        break;
      case "Amount (High to Low)":
        filteredOrders.sort((a, b) => b.amount - a.amount);
        break;
      case "Amount (Low to High)":
        filteredOrders.sort((a, b) => a.amount - b.amount);
        break;
      default:
        break;
    }

    return filteredOrders;
  };

  return (
    <div>
      <PageNav />
      <div className="container mt-4 fs-4">
      <h2 className="mb-4">SALES ORDER</h2>
      <div className="row mb-3">
        <div className="col-md-6">

          <label htmlFor="orderHistory" className="form-label">
            Order History
          </label>
          <select id="orderHistory" onChange={handleOrderHistoryChange} value={orderHistory} className="form-select fs-4">
            <option value="30 days">30 days of order history</option>
            <option value="60 days">60 days of order history</option>
            <option value="90 days">90 days of order history</option>
          </select>
        </div>
        <div className="col-md-6">
          <label htmlFor="sortBy" className="form-label">
            Sort By
          </label>
          <select id="sortBy" value={sortBy} onChange={handleSortByChange} className="form-select fs-4">
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
            value={searchText}
            onChange={handleSearchTextChange}
            className="form-control me-2 fs-4"
            placeholder="Find by order number"
          />
          <button className="btn btn-primary fs-4" type="button">
            <i className="fas fa-search"></i> Find
          </button>
        </div>
        <div className="col-md-6 d-flex flex-wrap justify-content-end">
        <button type="button" onClick={() => filterByStatus("All")} className="btn btn-outline-secondary me-2 mb-2">
            All ({orders.length})
          </button>
          
          <button type="button" onClick={() => filterByStatus("Work Order")} className="btn btn-outline-secondary me-2 mb-2">
            Work Orders ({statusCounts["Work Order"] || 0})
          </button>
          <button type="button" onClick={() => filterByStatus("Purchasing")}  className="btn btn-outline-secondary me-2 mb-2">
            Purchasing ({statusCounts["Purchasing"] || 0})
          </button>
          <button type="button" onClick={() => filterByStatus("Incoming")} className="btn btn-outline-secondary me-2 mb-2">
            Incoming ({statusCounts["Incoming"] || 0})
          </button>
          <button type="button" onClick={() => filterByStatus("Quality")} className="btn btn-outline-secondary me-2 mb-2">
            Quality ({statusCounts["Quality"] || 0})
          </button>
          <button type="button" onClick={() => filterByStatus("Kitting")} className="btn btn-outline-secondary me-2 mb-2">
            Kitting ({statusCounts["Kitting"] || 0})
          </button>
          <button type="button" onClick={() => filterByStatus("Production")} className="btn btn-outline-secondary mb-2">
            Production ({statusCounts["Production"] || 0})
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
          {filterOrders().map((order) => (
            <OrderItem key={order.id} order={order} />
          ))}
        </tbody>
      </table>
    </div>

    </div>
  );
};

export default Sales;
