// import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Dropdown, Input } from '../components/layout';
import PageNav from '../components/PageNav';
import { useState } from 'react';

const differenceInDays = (stringDate1, stringDate2) => {
  const date1 = new Date(stringDate1);
  const date2 = new Date(stringDate2);
  date1.setHours(0, 0, 0, 0);
  date2.setHours(0, 0, 0, 0);
  const differenceInTime = date1.getTime() - date2.getTime();
  const offsetInMinutes = new Date().getTimezoneOffset();
  const offsetInDays = offsetInMinutes / 60 / 24;
  const differenceInDays = differenceInTime / (1000 * 3600 * 24) + offsetInDays;
  const result =  Math.round(differenceInDays);
  return result < -10000 ? 0:result
};

function AppLayout() {
  const [values, setValues] = useState({
    shipDate1: null,
    shipDate2: null,
    orderDate: null,
    dateOfShipment: null,
    dateOfArrival: null,
  });
  let shippedOnTime = ''
  if(values.dateOfShipment && values.shipDate1){
    shippedOnTime = values.dateOfShipment <= values.shipDate1 ? 'Yes' : 'No'
  }

  return (
    <div>
      <PageNav />
      <div className="container my-4">
        <div className={'mt-5 fs-4 row'}>
          <div className="col-md-6">
            <Input label="Sales Order" />
            <Input label="Client" />
            <Input label="SKU#" />
            <Input label="Product name" />
            <Dropdown
              label="Family"
              options={['','Fam1', 'Fam2', 'Fam3', 'Fam4']}
            />
            <Dropdown label="Sub-family" options={['','SubFam1', 'SubFam2']} />
            <Dropdown label="Subject to shelf life?" options={['','Yes', 'No']} />
            <Input label="Order quantity" />
            <Dropdown label="Partial Shipment" options={['','Yes', 'No']} />
            <Input label="Bal due" />
            <Input
              label="Order date"
              type="date"
              name="orderDate"
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
              value={differenceInDays(values.shipDate1, new Date())}
            />
            <Input
              label="Count days to sched date 2"
              disabled={true}
              value={differenceInDays(values.shipDate2, new Date())}
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
              name="dateOfShipment"
              onChange={({ target }) =>
                setValues({ ...values, dateOfShipment: target.value })
              }
            />
            <Input
              label="Lead Time (from order to shipping)"
              disabled={true}
              value={differenceInDays(values.dateOfShipment, values.orderDate)}
            />
            <Input
              label="Shipped on time?"
              disabled={true}
              value={shippedOnTime}
            />
            <Dropdown
              label="Status of shipment"
              options={['','Delayed', 'On the way', 'Delivered']}
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
              value={differenceInDays(
                values.dateOfArrival,
                values.dateOfShipment
              )}
            />
            <Input
              label="Total time"
              disabled={true}
              value={differenceInDays(values.dateOfArrival, values.orderDate)}
            />
            <Input label="Comments" />
          </div>
        </div>

        <div className="d-flex justify-content-center align-items-center mt-5">
          <Link to="/work-order" className="btn btn-primary fs-4 10">
            Go to Work Orders
          </Link>
        </div>
      </div>
    </div>
  );
}

export default AppLayout;
