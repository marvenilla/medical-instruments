/* eslint-disable no-unused-vars */
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Dropdown, Input } from "../components/layout";
import PageNav from "../components/PageNav";
import { supabase } from "../supabase";
import { useForm } from "react-hook-form";

const exampleProducts = [
  {
    product_name: "Item 1",
    sku: "SKU1",
    family: "Family 1",
    subfamily: "Subfamily 1",
    subject_to_shelf_life: "Yes",
    unit: "Unit 1",
    quantity: 10,
    balance_due: 5,
  },
  {
    product_name: "Item 2",
    sku: "SKU1",
    family: "Family 1",
    subfamily: "Subfamily 1",
    subject_to_shelf_life: "Yes",
    unit: "Unit 1",
    quantity: 10,
    balance_due: 5,
  }
]

function AppLayout() {
  const [values, setValues] = useState({
    nextSalesId: null,
    client_id: null,
  });
  const [selectedProducts, setSelectedProducts] = useState(exampleProducts);
  const [sumbitLoading, setSubmitLoading] = useState(false);
  const { register, handleSubmit, reset } = useForm();
  const navigate = useNavigate();

  useEffect(() => {
    const getNextSalesId = async () => {
      const { data, error } = await supabase
        .from("SalesOrder")
        .select("sales_id, client_id");
      if (error) console.log("Error loading sales", error);
      else {
        const lastId = data.length
          ? Math.max(...data.map((order) => order.sales_id))
          : 0;
        const clientId = data[data.length - 3].client_id;
        setValues((prevValues) => ({
          ...prevValues,
          nextSalesId: lastId + 1,
          client_id: clientId,
        }));
      }
    };
    getNextSalesId();
  }, []);

  const handleSave = async (data) => {
    const sanitizedData = {
      ...data,
      client_id: values.client_id,

      order_date: data.order_date
        ? new Date(data.order_date).toISOString()
        : new Date().toISOString(), // Convert to Date object
      ship_date_1: data.ship_date_1
        ? new Date(data.ship_date_1).toISOString()
        : null,
      ship_date_2: data.ship_date_2
        ? new Date(data.ship_date_2).toISOString()
        : null,
      date_of_ship: data.date_of_ship
        ? new Date(data.date_of_ship).toISOString()
        : null,
      date_of_arrival: data.date_of_arrival
        ? new Date(data.date_of_arrival).toISOString()
        : null,
      total_cost: data.total_cost || 0,
      status: data.status || "Pending",
      currency: "CAD",
      order_details: data.product_name || "",
      order_quantity: data.order_quantity
        ? parseFloat(data.order_quantity)
        : null,
      bal_due: data.bal_due ? parseFloat(data.bal_due) : null,
    };
    try {
      setSubmitLoading(true);
      const { error } = await supabase
        .from("SalesOrder")
        .insert([sanitizedData]);
      if (error) {
        throw error;
      } else {
        alert("Product Creation was successful");
        reset();
        setSubmitLoading(false);
        navigate("/sales");
      }
    } catch (error) {
      alert("An unexpected error has occurred!");
      console.log("Error creating record in supabase", error);
      setSubmitLoading(false);
    }
  };

  return (
    <div>
      <PageNav />
      <div className="d-flex justify-content-center align-items-center mb-4">
        <div className="container" style={{ maxWidth: "1200px" }}>
          <form className="mt-5 fs-4" onSubmit={handleSubmit(handleSave)}>
            <h2 style={{ fontWeight: "bold" }}>Sales order</h2>
            <Input label="Id" disabled value={values.nextSalesId} />
            <Input register={register} label="Client name" name="client" />

            <hr className="hr my-4"/>
            <h2 style={{ fontWeight: "bold" }}>Product</h2>
            <Input
              label="Product name"
              name="product_name"
              register={register}
            />
            <Input
              register={register}
              name="stock"
              label="Stock"
              type="number"
              disabled
            />
            <Input
              register={register}
              name="order_quantity"
              label="Order quantity"
              type="number"
            />
            <Input
              register={register}
              name="bal_due"
              label="Bal due"
              disabled
            />
            <button className="btn btn-primary fs-4">
              Add product to sale
            </button>

            <table>
              <thead>
                <tr>
                  <th>Product Name</th>
                  <th>SKU</th>
                  <th>Family</th>
                  <th>Subfamily</th>
                  <th>Subject to Shelf Life</th>
                  <th>Unit</th>
                  <th>Quantity</th>
                  <th>Balance Due</th>
                </tr>
              </thead>
              <tbody>
                {selectedProducts.map((product, index) => (
                  <tr key={index}>
                    <td>{product.product_name}</td>
                    <td>{product.sku}</td>
                    <td>{product.family}</td>
                    <td>{product.subfamily}</td>
                    <td>{product.subject_to_shelf_life}</td>
                    <td>{product.unit}</td>
                    <td>{product.quantity}</td>
                    <td>{product.balance_due}</td>
                  </tr>
                ))}
              </tbody>
            </table>

            <hr className="hr my-4"/>
            <h2 className="mt-4" style={{ fontWeight: "bold" }}>
              Shipment
            </h2>
            <Input
              register={register}
              name="order_date"
              label="Order date"
              type="date"
            />

            <Dropdown
              label="Partial Shipment"
              name="partial_shipment"
              register={register}
              options={["", "Yes", "No"]}
            />

            <div className="row">
              <div className="col-md-6">
                <Input
                  register={register}
                  name="ship_date_1"
                  label="Ship Date 1"
                  type="date"
                />
              </div>
              <div className="col-md-6">
                <Input label="Count days to sched date 1" disabled={true} />
              </div>
            </div>
            {/* <div className="col-md-6"> */}
            <div className="row">
              <div className="col-md-6">
                <Input
                  register={register}
                  name="ship_date_2"
                  label="Ship Date 2"
                  type="date"
                />
              </div>
              <div className="col-md-6">
                <Input label="Count days to sched date 2" disabled={true} />
              </div>
            </div>

            <Dropdown
              label="Operation Status"
              register={register}
              name="status"
              hidden
              options={[
                "",
                "Work Order",
                "Purchasing",
                "Work Order",
                "Incoming",
                "Quality",
                "Kitting",
                "Production",
                "Shipping",
              ]}
            />

            <Input
              register={register}
              name="date_of_ship"
              label="Date of shipment"
              type="date"
            />
            <Input label="Lead Time (from order to shipping)" disabled={true} />
            <Input label="Shipped on time?" disabled={true} />
            <Dropdown
              label="Status of shipment"
              register={register}
              name="status_of_shipment"
              options={["", "Delayed", "On the way", "Delivered"]}
            />
            <Input
              register={register}
              name="date_of_arrival"
              label="Date of arrival"
              type="date"
            />
            <Input
              label="Transit time (from shipment to delivery)"
              disabled={true}
            />
            <Input label="Total time" disabled={true} />
            <Input register={register} name="comments" label="Comments" />

            <div className="d-flex gap-3 flex-row-reverse my-4">
              <button
                className="btn btn-primary fs-4 10 w-100"
                type="submit"
                style={{ maxWidth: "200px" }}
              >
                {sumbitLoading ? "Processing..." : "Save"}
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
    </div>
  );
}

export default AppLayout;
