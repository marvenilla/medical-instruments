/* eslint-disable no-unused-vars */
import { useEffect, useState } from "react";
import { Link, Navigate } from "react-router-dom";
import { Dropdown, Input, Autocomplete } from "../components/layout";
import PageNav from "../components/PageNav";
import { daysBetween, formatDate } from "../helpers";
import { supabase } from "../supabase";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";

function AppLayout() {
  const [values, setValues] = useState({
    nextSalesId: null,
    shipDate1: null,
    shipDate2: null,
    orderDate: null,
    operation: null,
    dateOfShipment: null,
    dateOfArrival: null,
    orderQuantity: null,
    productOrder: null,
    productUnits: null,
  });

  const [products, setProducts] = useState([]);
  const { register, handleSubmit, watch, reset, control } = useForm();
  const navigate= useNavigate();

  useEffect(() => {
    const fetchProducts = async () => {
      const { data, error } = await supabase.from("Product").select("*");
      if (error) console.log("Error loading products", error);
      else setProducts(data);
    };

    const getNextSalesId = async () => {
      const { data, error } = await supabase
        .from("SalesOrder")
        .select("sales_id");
      if (error) console.log("Error loading sales", error);
      else {
        const lastId = Math.max(...data.map((order) => order.sales_id));
        setValues({ ...values, nextSalesId: lastId + 1 });
      }
    };
    fetchProducts();
    getNextSalesId();
  }, []);

  const handleSave = async (data) => {
    const formatData = {
      ...data,
      productName: values.productOrder,
    }
    const { error } = await supabase.from("SalesOrder").insert([
      {
        client_id: 1,
        order_date: formatData.orderDate,
        total_cost: 0,
        status: formatData.operation,
        currency: "CAD",
        order_details: formatData.productName,
      },
    ]);
    if (error) alert(error.message);
    else alert("Saved successfully");
    reset()
    navigate("/sales")
  };

  let shippedOnTime = "";
  if (values.dateOfShipment && values.shipDate1) {
    shippedOnTime = values.dateOfShipment <= values.shipDate1 ? "Yes" : "No";
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
        <form className={"mt-5 fs-4 row"} onSubmit={handleSubmit(handleSave)}>
          <div className="col-md-6">
            <Input label="Sales Order" disabled value={values.nextSalesId} />
            <Input register={register} label="Client" name="client" />
            <Input register={register} label="SKU#" name="sku" />
            <Autocomplete
              label="Product name"
              name="productName"
              control={control}
              register={register}
              multiple={true}
              options={products.map((option) => ({
                ...option,
                label: `${option.product_name} - Units: ${option?.quantity}`,
              }))}
              onChange={(option) => {
                const [{ quantity }] = option; // [{},{}]
                const productOrder = option
                  .map(({ product_name }) => product_name)
                  .join(", ");
                setValues({ ...values, productOrder, productUnits: quantity });
              }}
            />
            <Dropdown
              label="Family"
              name="family"
              register={register}
              options={["", "Fam1", "Fam2", "Fam3", "Fam4"]}
            />
            <Dropdown
              label="Sub-family"
              name="subFamily"
              register={register}
              options={["", "SubFam1", "SubFam2"]}
            />
            <Dropdown
              label="Subject to shelf life?"
              name="shelfLife"
              register={register}
              options={["", "Yes", "No"]}
            />
            <div className="d-flex align-items-center gap-4">
              <Input
                register={register}
                name="orderQuantity"
                label="Order quantity"
                type="number"
                value={values.orderQuantity}
                onChange={({ target }) =>
                  setValues({ ...values, orderQuantity: Number(target.value) })
                }
              />
              <button
                className="btn btn-primary fs-5 10"
                type="button"
                disabled={disableButton}
              >
                <Link
                  to="/work-order"
                  className="text-light text-decoration-none text-nowrap"
                >
                  Create work order
                </Link>
              </button>
            </div>
            <Dropdown
              label="Partial Shipment"
              name={"partialShipment"}
              register={register}
              value={values.partialShipment}
              options={["", "Yes", "No"]}
            />
            <Input
              register={register}
              name="balDue"
              label="Bal due"
              value={values.balDue}
            />
            <Input
              register={register}
              name="orderDate"
              label="Order date"
              type="date"
              onChange={({ target }) =>
                setValues({ ...values, orderDate: target.value })
              }
            />
          </div>
          <div className="col-md-6">
            <Input
              register={register}
              name="shipDate1"
              label="Ship Date 1"
              type="date"
              onChange={({ target }) =>
                setValues({ ...values, shipDate1: target.value })
              }
            />
            <Input
              register={register}
              name="shipDate2"
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
              register={register}
              hidden={true}
              name="operation"
              onChange={({ target }) =>
                setValues({ ...values, operation: target.value })
              }
              options={[
                "Work Order",
                "Purchasing",
                "Incoming",
                "Engineering",
                "Kitting",
                "Production",
                "Quality",
                "FG1",
                "FG2",
                "Shipped",
              ]}
            />
            <Input
              register={register}
              name="dateOfShipment"
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
              register={register}
              name="statusOfShipment"
              options={["", "Delayed", "On the way", "Delivered"]}
            />
            <Input
              register={register}
              name="dateOfArrival"
              label="Date of arrival"
              type="date"
              onChange={({ target }) =>
                setValues({ ...values, dateOfArrival: target.value })
              }
            />
            <Input
              label="Transit time (from shipment to delivery)"
              disabled={true}
              value={daysBetween(values.dateOfArrival, values.dateOfShipment)}
            />
            <Input
              label="Total time"
              disabled={true}
              value={daysBetween(values.dateOfArrival, values.orderDate)}
            />
            <Input register={register} name="comments" label="Comments" />
          </div>

          <div className="d-flex gap-3 flex-row-reverse mt-4">
            <button
              className="btn btn-primary fs-4 10 w-100"
              type="submit"
              style={{ maxWidth: "200px" }}
            
            >
              Save
            </button>
            <button
              className="btn btn-outline-primary fs-4 10 w-100"
              style={{ maxWidth: "200px" }}
              type="button"
              onClick={() => {
                reset();
              }}
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
