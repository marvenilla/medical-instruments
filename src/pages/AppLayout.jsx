// import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Dropdown, Input, Autocomplete } from '../components/layout';
import PageNav from '../components/PageNav';
import { useState } from 'react';
import { daysBetween, formatDate } from '../helpers';

const arrayProducts = [
  {
    productId: 1,
    name: 'Item 1',
    stock: 10,
  },
  {
    productId: 2,
    name: 'Item 2',
    stock: 8,
  },
  {
    productId: 3,
    name: 'Item 3',
    stock: 15,
  },
  {
    productId: 4,
    name: 'Item 4',
    stock: 0,
  },
  {
    productId: 5,
    name: 'Item 5',
    stock: 2,
  },
];

function AppLayout() {
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
    disableButton =
      values.productUnits !== 0 && values.productUnits > values.orderQuantity;

  return (
    <div>
      <PageNav />
      <div className="container my-4">
        <form className={'mt-5 fs-4 row'}>
          <div className="col-md-6">
            <Input label="Sales Order" />
            <Input label="Client" />
            <Input label="SKU#" />
            <Autocomplete
              label="Product name"
              options={arrayProducts}
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
              options={[
                '',
                'Word Order',
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
              type="date"
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
              options={['', 'Delayed', 'On the way', 'Delivered']}
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
}

export default AppLayout;
