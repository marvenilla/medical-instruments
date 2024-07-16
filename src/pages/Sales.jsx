import { useState, useEffect } from "react";
import PageNav from "../components/PageNav";
import OrderList from "../components/OrderList";

const Sales = () => {
  const [orders, setOrders] = useState([]);

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

  return (
    <div>
      <PageNav />
      <OrderList orders={orders} />
    </div>
  );
};

export default Sales;
