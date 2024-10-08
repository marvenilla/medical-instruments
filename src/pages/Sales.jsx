import { useState, useEffect } from "react";
import PageNav from "../components/PageNav";
import OrderItem from "../components/OrderItem";
import { supabase } from "../supabase";

const Sales = () => {
  const [orders, setOrders] = useState([]);
  const [orderHistory, setOrderHistory] = useState("30 days");
  const [sortBy, setSortBy] = useState("Order Date (Newest)");
  const [loading, setLoading] = useState(true);
  const [searchText, setSearchText] = useState("");
  const [statusData, setStatusData] = useState([]);

  useEffect(() => {
    const getSalesOrder = async () => {
      const { data, error } = await supabase
        .from("SalesOrder")
        .select()
        .order('sales_id', { ascending: false });
      if (error) {
        console.log("Error fetching sales order data:", error.message)
        setLoading(false);
      }

      const salesOrderData = data.map((order) => ({
        id: order.sales_id,
        date: order.order_date,
        client: order.client,
        shipmentDate: order.date_of_ship,
        ordered_products: order.ordered_products,
        amount: order.total_cost,
        status: order.status,
        shipmentStatus: order.status_of_shipment,
        description: order.comments,
      }));
      setLoading(false);
      setOrders(salesOrderData);
    };
    getSalesOrder();
  }, []);

  const handleOrderHistoryChange = (e) => setOrderHistory(e.target.value);
  const handleSortByChange = (e) => setSortBy(e.target.value);
  const handleSearchTextChange = (e) => setSearchText(e.target.value);

  const filterByStatus = (status) => {
    if (status === "All") {
      setOrders(orders);
      setStatusData(orders);
    } else {
      const filtered = orders.filter((order) => order.status === status);
      setStatusData(filtered);
    }
  };

  const statusCounts = orders.reduce((acc, order) => {
    acc[order.status] = (acc[order.status] || 0) + 1;
    return acc;
  }, {});

  const filterOrders = (arrayOrders) => {
    let filteredOrders = arrayOrders;

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
    filteredOrders = filteredOrders.filter(
      (order) => new Date(order.date) >= cutoffDate
    );

    //Filter by status selection
    if (statusData.length > 0) {
      filteredOrders = statusData;
    }
    // Filter by search text
    if (searchText) {
      filteredOrders = filteredOrders.filter((order) =>
        order.id == searchText
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

  const handleDelete = async (salesId) => {
    try {
      const { error: productError } = await supabase
        .from("SalesProduct")
        .delete()
        .eq("sales_id", salesId);

      if (productError) throw productError;

      const { error: orderError } = await supabase
        .from("SalesOrder")
        .delete()
        .eq("sales_id", salesId);

      if (orderError) throw orderError;

      setOrders(orders.filter(order => order.id !== salesId));

      alert("Order and associated products deleted successfully");
    } catch (error) {
      console.error("Error deleting the order:", error.message);
      alert("An unexpected error occurred while deleting the order.");
    }
  };

  return (
    <div>
      <PageNav />
      <div className="d-flex justify-content-center align-items-center mt-4">
        <div className="container fs-4" style={{ maxWidth: '1200px' }}>
          <h2 className="mb-4">SALES ORDER</h2>
          <div className="row mb-3">
            <div className="col-md-6">
              <label htmlFor="orderHistory" className="form-label">
                Order History
              </label>
              <select
                id="orderHistory"
                onChange={handleOrderHistoryChange}
                value={orderHistory}
                className="form-select fs-4"
              >
                <option value="30 days">30 days of order history</option>
                <option value="60 days">60 days of order history</option>
                <option value="90 days">90 days of order history</option>
              </select>
            </div>
            <div className="col-md-6">
              <label htmlFor="sortBy" className="form-label">
                Sort By
              </label>
              <select
                id="sortBy"
                value={sortBy}
                onChange={handleSortByChange}
                className="form-select fs-4"
              >
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
            <div className="col-md-6 d-flex flex-wrap justify-content-center">
              <button
                type="button"
                onClick={() => filterByStatus("All")}
                className="btn btn-outline-secondary me-2 mb-2"
              >
                All ({orders.length})
              </button>

              <button
                type="button"
                onClick={() => filterByStatus("Work Order - Initial")}
                className="btn btn-outline-secondary me-2 mb-2"
              >
                Work Order - Initial ({statusCounts["Work Order - Initial"] || 0})
              </button>
              <button
                type="button"
                onClick={() => filterByStatus("Work Order - Secondary")}
                className="btn btn-outline-secondary me-2 mb-2"
              >
                Work Order - Secondary ({statusCounts["Work Order - Secondary"] || 0})
              </button>
              <button
                type="button"
                onClick={() => filterByStatus("Purchasing")}
                className="btn btn-outline-secondary me-2 mb-2"
              >
                Purchasing ({statusCounts["Purchasing"] || 0})
              </button>
              <button
                type="button"
                onClick={() => filterByStatus("Incoming")}
                className="btn btn-outline-secondary me-2 mb-2"
              >
                Incoming ({statusCounts["Incoming"] || 0})
              </button>
              <button
                type="button"
                onClick={() => filterByStatus("Quality")}
                className="btn btn-outline-secondary me-2 mb-2"
              >
                Quality ({statusCounts["Quality"] || 0})
              </button>
              <button
                type="button"
                onClick={() => filterByStatus("Kitting")}
                className="btn btn-outline-secondary me-2 mb-2"
              >
                Kitting ({statusCounts["Kitting"] || 0})
              </button>
              <button
                type="button"
                onClick={() => filterByStatus("Production")}
                className="btn btn-outline-secondary mb-2"
              >
                Production ({statusCounts["Production"] || 0})
              </button>
              <button
              type="button"
              onClick={() => filterByStatus("Shipping")}
              className="btn btn-outline-secondary mb-2"
            >
              Shipping ({statusCounts["Shipping"] || 0})
            </button>

            </div>
          </div>

          <table className="table table-bordered">
            <thead className="table-light">
              <tr>
                <th scope="col">Sales Order #</th>
                <th scope="col">Order Date</th>
                <th scope="col">Client Name</th>
                <th scope="col">Ordered Products</th>
                <th scope="col">Product Total</th>
                <th scope="col">Operation Status</th>
                <th scope="col">Shipment Status</th>
                <th scope="col">Shipment Date</th>
                <th scope="col">Action</th>
              </tr>
            </thead>
            <tbody>
              {loading ? <div>Loading...</div> : ''}
              {filterOrders(orders).map((order, index) => (
                <OrderItem key={order.id} order={order} index={index} onDelete={handleDelete} />
              ))}
            </tbody>
          </table>

        </div>
      </div>
    </div>
  );
};

export default Sales;
