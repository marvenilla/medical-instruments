import { useState }  from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Link } from 'react-router-dom';
import { Dropdown, Input, Autocomplete } from '../components/layout';
import PageNav from '../components/PageNav';
import { daysBetween, formatDate } from '../helpers';
import { dummyOrders as orders } from "../helpers/orderData";

const SalesOrderDetails = () => {
    const [values, setValues] = useState({
        shipDate1: null,
        shipDate2: null,
        orderDate: null,
        dateOfShipment: null,
        dateOfArrival: null,
        orderQuantity: null,
        productUnits: null,
      });

      let shippedOnTime = '';
      if (values.dateOfShipment && values.shipDate1) {
        shippedOnTime = values.dateOfShipment <= values.shipDate1 ? 'Yes' : 'No';
      }
    
      // Logic to disable the button to create a work order
      let disableButton = true;
      if (values.productUnits != null && values.orderQuantity != null)
        disableButton = values.productUnits !== 0 && values.productUnits > values.orderQuantity;
    

  const { id } = useParams();
  const order = orders.find((order) => order.id === id);


  const navigate = useNavigate();
  const handleSalesOrderUpdate = () => {
    navigate("/sales");
  }

  if (!order) {
    return <div>Order not found</div>;
  }

  return (
    <div>
      <PageNav />
      <div className="container my-4">
        <form className={'mt-5 fs-4 row'}>
          <div className="col-md-6">
            <Input label="Sales Order" value={order.id}  />
            <Input label="Client" />
            <Input label="SKU#" />
            <Autocomplete
              label="Product name"
              options={orders}
              onChange={(option) => {
                const [{ stock }] = option;
                setValues({ ...values, productUnits: stock });
              }}
            />
            <Dropdown
              label="Family"
              options={['', 'Fam1', 'Fam2', 'Fam3', 'Fam4']}
            />
            <Dropdown label="Sub-family" options={['', 'SubFam1', 'SubFam2']} />
            <Dropdown
              label="Subject to shelf life?"
              options={['', 'Yes', 'No']}
            />
            <div className="d-flex align-items-center gap-4">
              <Input
                label="Order quantity"
                type="number"
                onChange={({ target }) =>
                  setValues({ ...values, orderQuantity: Number(target.value) })
                }
              />
              <button
                className="btn btn-primary fs-5 10"
                disabled={disableButton}
              >
                <Link
                  to="/work-order"
                  className="text-light text-decoration-none text-nowrap"
                >
                  Create work order
                </Link>
              </button>
              {/* <Link to="/work-order" className="btn btn-primary fs-5 10">
                Create Work Orders
              </Link> */}
            </div>
            <Dropdown label="Partial Shipment" options={['', 'Yes', 'No']} />
            <Input label="Bal due" />
            <Input
              label="Order date"
              type="date"
              onChange={({ target }) =>
                setValues({ ...values, orderDate: target.value })
              }
            />
          </div>
          <div className="col-md-6">
            <Input
              label="Ship Date 1"
              type="date"
              onChange={({ target }) =>
                setValues({ ...values, shipDate1: target.value })
              }
            />
            <Input
              label="Ship Date 2"
              type="date"
              onChange={({ target }) => {
                setValues({ ...values, shipDate2: target.value });
              }}
            />
            <Input
              label="Count days to sched date 1"
              disabled={true}
              value={daysBetween(values.shipDate1, formatDate(new Date()))}
            />
            <Input
              label="Count days to sched date 2"
              disabled={true}
              value={daysBetween(values.shipDate2, formatDate(new Date()))}
            />
            <Dropdown
              label="Operation"
              value={order.status}
              
              options={[
                '',
                'Work Order',
                'Purchasing',
                'Incoming',
                'Engineering',
                'Kitting',
                'Production',
                'Quality',
                'FG1',
                'FG2',
                'Shipped',
              ]}
            />
            <Input
              label="Date of shipment"
              type="text"
              value={order.shipmentDate}
              onChange={({ target }) =>
                setValues({ ...values, dateOfShipment: target.value })
              }
              
            />
            <Input
              label="Lead Time (from order to shipping)"
              disabled={true}
              value={daysBetween(values.dateOfShipment, values.orderDate)}
            />
            <Input
              label="Shipped on time?"
              disabled={true}
              value={shippedOnTime}
            />
            <Dropdown
              label="Status of shipment"
              value={order.shipmentStatus}
              options={['', 'Delayed', 'Open', 'Closed', 'On the way', 'Delivered']}
              
            />
            <Input
              label="Date of arrival"
              type="date"
              onChange={({ target }) =>
                setValues({ ...values, dateOfArrival: target.value })
              }
            />
            <Input
              label="Transit time (from shipment to delivery)"
              disabled={true}
              value={daysBetween(
                values.dateOfArrival,
                values.dateOfShipment
              )}
            />
            <Input
              label="Total time"
              disabled={true}
              value={daysBetween(values.dateOfArrival, values.orderDate)}
            />
            <Input label="Comments" />
          </div>

          <div className='d-flex gap-3 flex-row-reverse mt-4'>
            <button
              onClick={handleSalesOrderUpdate}
              className="btn btn-primary fs-4 10 w-100"
              style={{ maxWidth: '200px' }}
            >
              Save
            </button>
            <button
              className="btn btn-outline-primary fs-4 10 w-100"
              style={{ maxWidth: '200px' }}
            >
              Clear
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SalesOrderDetails;
